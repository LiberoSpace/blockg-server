import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PostComment } from './entities/post-comment.entity';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
  ) {}

  async getPostComments(postId: number): Promise<PostComment[]> {
    return await this.postCommentRepository.find({
      where: {
        postId: postId,
      },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getPostCommentCount(postId: number): Promise<number> {
    return await this.postCommentRepository.countBy({
      postId: postId,
    });
  }

  async createPostComment(
    { postId, content }: { postId: number; content: string },
    requestUser: User,
  ): Promise<number> {
    const insertedResult = await this.postCommentRepository.insert({
      userId: requestUser.id,
      postId: postId,
      content: content,
    });

    return Number(insertedResult.identifiers[0].id);
  }

  async deletePostComment(
    { postId, postCommentId }: { postId: number; postCommentId: number },
    requestUser: User,
  ) {
    const postComment = await this.postCommentRepository.findOneBy({
      id: postCommentId,
    });
    if (postComment?.userId !== requestUser.id) {
      throw new ForbiddenException('댓글 작성자만 댓글을 삭제할 수 있습니다.');
    }

    await this.postCommentRepository.delete({ id: postComment.id });
  }
}
