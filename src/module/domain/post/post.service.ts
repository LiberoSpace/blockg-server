import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';
import { UpdatePostMetadataDto } from './apis/dtos/update-post-metadata.dto';
import { UpdatePostDto } from './apis/dtos/update-post.dto';
import { Block } from './entities/block.entity';
import { Post } from './entities/post.entity';
import { BlockType } from './enums/block-type.enum';
import { PostStatus } from './enums/post-status.enum';
import { UpdatePostEvent } from './enums/update-post-event.enum';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    private exchangeRateService: ExchangeRateService,
  ) {}

  // async findAll(): Promise<Post[]> {
  //   return await this.postRepository.find();
  // }

  // TODO: 개인 생각 블록 처리
  async findOne(referenceId: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { referenceId: referenceId },
      relations: { user: true },
    });
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
    // ## 글 업데이트 인터페이스에 정보 추가
    const postUpdateInterface: QueryDeepPartialEntity<Post> = {
      title: dto.title,
      status: dto.status,
      blockCount: blocks.length, // 블럭 개수 계산
      content: blocks,
    };
    // 썸네일 지정
    const thumbnailBlock = blocks.find((block) => block.isThumbnail);
    postUpdateInterface.thumbnailUrl = thumbnailBlock?.url ?? null;
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

    console.log(postUpdateInterface);
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
}
