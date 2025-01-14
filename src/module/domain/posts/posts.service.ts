import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdatePostMetadataDto } from './dtos/update-post-metadata.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Block } from './entities/block.entity';
import { Post } from './entities/post.entity';
import { PostStatus } from './enums/post-status.enum';
import { UpdatePostEvent } from './enums/update-post-event.enum';
import { BlockType } from './enums/block-type.enum';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // async findAll(): Promise<Post[]> {
  //   return await this.postsRepository.find();
  // }

  // async findOne(id: number): Promise<Post | null> {
  //   return await this.postsRepository.findOneBy({ id });
  // }

  async createPost(userId: number): Promise<Number> {
    const insertResult = await this.postsRepository.insert({
      userId,
    });
    return Number(insertResult.identifiers[0].id);
  }

  async updatePost(postId: number, userId: number, dto: UpdatePostDto) {
    let post = await this.postsRepository.findOneBy({
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
      expenseBlocks.forEach((block) => {
        totalExpense += block.expense!;
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
    await this.postsRepository.update({ id: postId }, postUpdateInterface);
  }

  async updatePostMetadata(postId: number, dto: UpdatePostMetadataDto) {
    switch (dto.event) {
      case UpdatePostEvent.VIEW:
        await this.postsRepository.increment({ id: postId }, 'views', 1);
        break;
      case UpdatePostEvent.SHARE:
        await this.postsRepository.increment({ id: postId }, 'shareCount', 1);
        break;
      default:
    }
  }

  async deletePost(id: number): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
