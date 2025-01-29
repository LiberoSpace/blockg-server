import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PostLike } from '../entities/post-like.entity';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
  ) {}

  async getPostLike(
    postId: number,
    requestUser: User,
  ): Promise<PostLike | null> {
    return await this.postLikeRepository.findOneBy({
      postId: postId,
      userId: requestUser.id,
    });
  }

  async getPostLikeCount(postId: number): Promise<number> {
    return await this.postLikeRepository.countBy({
      postId: postId,
    });
  }

  async createPostLike(postId: number, actor: User): Promise<number> {
    const insertedResult = await this.postLikeRepository.insert({
      userId: actor.id,
      postId: postId,
    });

    return Number(insertedResult.identifiers[0].id);
  }

  async deletePostLike(postLikeId: number, actor: User) {
    await this.postLikeRepository.delete({
      id: postLikeId,
      userId: actor.id,
    });
  }
}
