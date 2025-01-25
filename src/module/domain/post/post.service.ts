import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  FindManyOptions,
  ILike,
  LessThan,
  Or,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';
import { UpdatePostMetadataDto } from './apis/dtos/update-post-metadata.dto';
import { UpdatePostDto } from './apis/dtos/update-post.dto';
import { Block } from './entities/block.entity';
import { Post } from './entities/post.entity';
import { BlockType } from './enums/block-type.enum';
import { PostStatus } from './enums/post-status.enum';
import { UpdatePostEvent } from './enums/update-post-event.enum';
import { User } from '../user/entities/user.entity';
import { Page } from '../../../utils/page';
import { GetPostsDto } from './apis/dtos/get-posts.dto';
import { PostCommentService } from './post-comment.service';
import { PostLikeService } from './post-like.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    private exchangeRateService: ExchangeRateService,
    private postLikeService: PostLikeService,
    private postCommentService: PostCommentService,
  ) {}

  async findPage(dto: GetPostsDto): Promise<Page<Post>> {
    const dbQuery = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('status = :status', { status: PostStatus.PUBLISHED })
      .orderBy('"publishedAt"', 'DESC')
      .limit(dto.limit)
      .offset(dto.page * dto.limit);

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

    const [posts, totalCount] = await dbQuery.getManyAndCount();

    return new Page(totalCount, posts, dto.limit, dto.page);
  }

  async findOne(referenceId: string, requestUser?: User): Promise<Post | null> {
    const post = await this.postRepository.findOne({
      where: { referenceId: referenceId },
      relations: { user: true },
    });

    if (!post) return null;
    [post.likeCount, post.commentCount] = await Promise.all([
      await this.postLikeService.getPostLikeCount(post.id),
      await this.postCommentService.getPostCommentCount(post.id),
    ]);
    return post;
  }

  async createPost(userId: number): Promise<Post> {
    const insertResult = await this.postRepository.insert({
      userId,
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
    const post = await this.postRepository.findOneBy({
      id: postId,
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
    } else {
      postUpdateInterface.totalExpense = null;
    }

    // 첫 발행시각 추가
    if (
      post.status !== PostStatus.PUBLISHED &&
      dto.status === PostStatus.PUBLISHED
    ) {
      postUpdateInterface.publishedAt = new Date();
    }

    await this.postRepository.update({ id: postId }, postUpdateInterface);
  }

  async updatePostMetadata(referenceId: string, dto: UpdatePostMetadataDto) {
    switch (dto.event) {
      case UpdatePostEvent.VIEW:
        await this.postRepository.increment(
          { referenceId: referenceId },
          'views',
          1,
        );
        break;
      case UpdatePostEvent.SHARE:
        await this.postRepository.increment(
          { referenceId: referenceId },
          'shareCount',
          1,
        );
        break;
      default:
    }
  }

  async deletePost(postId: number, userId: number): Promise<void> {
    const post = await this.postRepository.findOneBy({
      id: postId,
    });
    if (!post) throw new NotFoundException('삭제하려는 글이 없습니다.');
    if (post.userId != userId)
      throw new ForbiddenException('글에 대한 소유권이 없습니다.');

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
}
