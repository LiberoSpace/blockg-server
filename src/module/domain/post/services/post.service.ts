import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, LessThan, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Page } from '../../../../utils/page';
import { ExchangeRateService } from '../../exchange-rate/services/exchange-rate.service';
import { User } from '../../user/entities/user.entity';
import { GetPostsDto } from '../controllers/dtos/get-posts.dto';
import { UpdatePostMetadataDto } from '../controllers/dtos/update-post-metadata.dto';
import { UpdatePostDto } from '../controllers/dtos/update-post.dto';
import { Block } from '../entities/block.entity';
import { PostTag } from '../entities/post-tag.entity';
import { Post } from '../entities/post.entity';
import { BlockType } from '../enums/block-type.enum';
import { PostStatus } from '../enums/post-status.enum';
import { UpdatePostEvent } from '../enums/update-post-event.enum';
import { PostCommentService } from './post-comment.service';
import { PostLikeService } from './post-like.service';
import { PostTagTypeCount } from '../classes/post-tag-type-count';
import { FirebaseAdmin } from '../../../firebase/firebase-admin';
import { PostCountryCount } from '../classes/post-country-count';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostTag)
    private postTagRepository: Repository<PostTag>,

    private exchangeRateService: ExchangeRateService,
    private postLikeService: PostLikeService,
    private postCommentService: PostCommentService,
    private firebaseAdmin: FirebaseAdmin,
  ) {}

  async findPage(dto: GetPostsDto, handle?: string): Promise<Page<Post>> {
    const dbQuery = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('status = :status', { status: PostStatus.PUBLISHED })
      .orderBy('"publishedAt"', 'DESC')
      .limit(dto.limit)
      .offset(dto.page * dto.limit);

    if (handle) {
      dbQuery.andWhere('user.handle = :handle', { handle: handle });
    }

    if (dto.curationNumber) {
      dbQuery.andWhere('"curationNumber" = :curationNumber', {
        curationNumber: dto.curationNumber,
      });
    }

    if (dto.search) {
      dbQuery.andWhere(
        new Brackets((qb) => {
          qb.where('title LIKE :search', { search: `%${dto.search}%` }).orWhere(
            'content::text LIKE :search',
            { search: `%${dto.search}%` },
          );
        }),
      );
    }

    if (dto.domesticCountryCode) {
      if (dto.domesticCountryCode.startsWith('!')) {
        dbQuery.andWhere(':code != ANY(countries)', {
          code: dto.domesticCountryCode.slice(1),
        });
      } else {
        dbQuery.andWhere(':code = ANY(countries)', {
          code: dto.domesticCountryCode,
        });
      }
    }

    if (dto.minExpense) {
      dbQuery.andWhere('"totalExpense" >= :minExpense', {
        minExpense: dto.minExpense,
      });
    }
    if (dto.maxExpense) {
      dbQuery.andWhere('"totalExpense" <= :maxExpense', {
        maxExpense: dto.maxExpense,
      });
    }

    const [posts, totalCount] = await dbQuery.getManyAndCount();

    return new Page(totalCount, posts, dto.limit, dto.page);
  }

  async findOne(handle: string, postNumber: number): Promise<Post | null> {
    const post = await this.postRepository.findOne({
      where: { user: { handle: handle }, postNumber: postNumber },
      relations: { user: true, postTags: true },
    });

    if (!post) return null;
    [post.likeCount, post.commentCount] = await Promise.all([
      await this.postLikeService.getPostLikeCount(post.id),
      await this.postCommentService.getPostCommentCount(post.id),
    ]);
    return post;
  }

  async createPost(userId: number): Promise<Post> {
    const lastPost = await this.postRepository.findOne({
      where: { userId },
      order: { postNumber: 'DESC' },
    });
    let postNumber = lastPost ? lastPost.postNumber + 1 : 1;

    const insertResult = await this.postRepository.insert({
      userId,
      postNumber,
    });
    const insertedPost = await this.postRepository.findOneBy({
      id: Number(insertResult.identifiers[0].id),
    });
    if (!insertedPost) {
      throw new InternalServerErrorException();
    }

    return insertedPost;
  }

  async updatePost(postId: number, userId: number, dto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: {
        postTags: true,
      },
    });
    if (!post) {
      throw new NotFoundException('해당 글이 없습니다.');
    }
    if (post.userId !== userId) {
      throw new ForbiddenException('해당 글에 작성권한이 없습니다.');
    }

    const blocks = dto.blocks.map((blockDto, index) => {
      try {
        return Block.fromBlockDto(blockDto);
      } catch (e) {
        console.error(`${index}번째 block에서 문제 발생`);
        console.error(e);
        throw e;
      }
    });
    const blockCount = blocks.filter(
      (block) => block.type !== BlockType.SECRET,
    ).length;
    if (blockCount === 0) {
      throw new BadRequestException(
        '1개 이상의 비밀글이 아닌 블록을 넣어야 합니다.',
      );
    }

    // ## 글 업데이트 인터페이스에 정보 추가
    const postUpdateInterface: QueryDeepPartialEntity<Post> = {
      title: dto.title,
      status: dto.status,
      blockCount: blockCount, // 블럭 개수 계산
      content: blocks,
    };

    // 썸네일 지정
    const thumbnailImageBlock = blocks.find((block) => block.isThumbnail);
    postUpdateInterface.thumbnailUrl = thumbnailImageBlock?.url ?? null;
    const thumbnailTextBlock = blocks.find(
      (block) => block.type === BlockType.TEXT,
    );
    postUpdateInterface.thumbnailText = thumbnailTextBlock?.content ?? null;

    // 총 비용 계산
    const expenseBlocks = blocks.filter(
      (block) => block.type === BlockType.EXPENSE,
    );
    if (expenseBlocks.length !== 0) {
      let totalExpense = 0;
      const exchangeRate =
        await this.exchangeRateService.getLatestExchangeRate();
      expenseBlocks.forEach((block) => {
        const conversionRateFromUSD =
          exchangeRate.conversionRate[block.currencyCode!];
        if (!conversionRateFromUSD) {
          throw new BadRequestException(
            '비용 블럭 화폐 코드를 지원하지 않거나 잘못되었습니다.',
          );
        }
        const rate =
          Number(exchangeRate.conversionRate['KRW']) /
          Number(conversionRateFromUSD);

        totalExpense += Math.round((block.expense! * rate)!);
      });
      postUpdateInterface.totalExpense = totalExpense;
    }

    // 국가 및 도시 배열 추가
    const placeBlocks = blocks.filter(
      (block) => block.type === BlockType.PLACE,
    );
    if (placeBlocks.length !== 0) {
      const countries: string[] = [];
      const cities: string[] = [];
      placeBlocks.forEach((block) => {
        const countryComponent = block.googleMapsData.address_components.find(
          (component) => component.types.find((type) => type === 'country'),
        );
        if (!countryComponent) return;

        countries.push(countryComponent.short_name);

        if (countryComponent.short_name === 'KR') {
          const cityComponent = block.googleMapsData.address_components.find(
            (component) =>
              component.types.find(
                (type) => type === 'administrative_area_level_1',
              ),
          );
          if (!cityComponent) return;

          cities.push(cityComponent.short_name);
        }
      });
      postUpdateInterface.countries = countries;
      postUpdateInterface.cities = cities;
    }

    // 첫 발행시각 추가
    if (
      post.status !== PostStatus.PUBLISHED &&
      dto.status === PostStatus.PUBLISHED
    ) {
      postUpdateInterface.publishedAt = new Date();
    }

    // 업데이트 필요한 태그 가져오기
    const existTagTypes = post.postTags.map((tag) => tag.tagType);
    const addTagTypes = dto.postTagTypes.filter(
      (tagType) => !existTagTypes.includes(tagType),
    );
    const deleteTagTypes = existTagTypes.filter(
      (tagType) => !dto.postTagTypes.includes(tagType),
    );

    await this.postRepository.manager.transaction(async (manager) => {
      addTagTypes.map(async (addTagType) => {
        await manager.insert(PostTag, {
          tagType: addTagType,
          post: post,
        });
      });
      deleteTagTypes.map(async (deleteTagType) => {
        await manager.delete(PostTag, {
          tagType: deleteTagType,
          postId: post.id,
        });
      });
      await manager.update(Post, { id: postId }, postUpdateInterface);
    });
  }

  async updatePostMetadata(postId: number, dto: UpdatePostMetadataDto) {
    switch (dto.event) {
      case UpdatePostEvent.VIEW:
        await this.postRepository.increment({ id: postId }, 'views', 1);
        break;
      case UpdatePostEvent.SHARE:
        await this.postRepository.increment({ id: postId }, 'shareCount', 1);
        break;
      default:
    }
  }

  async deletePost(postId: number, userId: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: { user: true },
    });
    if (!post) throw new NotFoundException('삭제하려는 글이 없습니다.');

    if (post.userId != userId)
      throw new ForbiddenException('글에 대한 소유권이 없습니다.');

    // storage 내부에 데이터 삭제
    await this.firebaseAdmin.deleteStoragePostData(
      post.user.uid,
      post.postNumber,
    );

    await this.postRepository.delete({ id: postId });
  }

  async deleteTemporaryPosts() {
    const currentDate = new Date();
    const oneDayBefore = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    await this.postRepository.delete({
      status: PostStatus.TEMPORARY,
      createdAt: LessThan(oneDayBefore),
    });
  }

  async getUserPostTagsStatistics(userId: number): Promise<PostTagTypeCount[]> {
    const tagTypes = await this.postTagRepository
      .createQueryBuilder('postTag')
      .select('"tagType"')
      .addSelect('COUNT("tagType")::integer')
      .leftJoin('postTag.post', 'post')
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .andWhere('post.userId = :userId', { userId: userId })
      .groupBy('"tagType"')
      .orderBy('count', 'DESC')
      .getRawMany<PostTagTypeCount>();

    // 많은 순 정렬
    // tagTypes.sort((a, b) => b.count - a.count);

    return tagTypes;
  }

  async getPostStatistics(userId?: number): Promise<PostCountryCount[]> {
    let postStatistics: PostCountryCount[];
    if (userId) {
      postStatistics = await this.postRepository.query(
        `SELECT country, COUNT(*)::integer
        FROM post, unnest(countries) AS country
        WHERE status = $1
        AND "userId" = $2
        GROUP BY country
        ORDER BY count DESC;`,
        [PostStatus.PUBLISHED, userId],
      );
    } else {
      postStatistics = await this.postRepository.query(
        `SELECT country, COUNT(*)::integer
        FROM post, unnest(countries) AS country
        WHERE status = $1
        GROUP BY country
        ORDER BY count DESC;`,
        [PostStatus.PUBLISHED],
      );
    }

    return postStatistics;
  }
}
