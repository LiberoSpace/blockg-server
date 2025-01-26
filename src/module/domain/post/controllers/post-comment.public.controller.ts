import { Controller, Get, Param, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PostCommentService } from '../services/post-comment.service';
import { GetPostCommentRdto } from './rdtos/get-post-comments.rdto';

@ApiBearerAuth('JWT')
@ApiTags('글 댓글')
@Controller('blockg/public-api/v1/posts/:postId/comments')
export class PostCommentPublicController {
  constructor(private readonly postCommentService: PostCommentService) {}

  @ApiOperation({
    summary: '글 댓글 조회하기',
  })
  @ApiOkResponse({
    description: 'postId에 해당하는 댓글들',
    type: GetPostCommentRdto,
    isArray: true,
  })
  @Get('')
  async getPostComments(
    @Param('postId') postId: number,
  ): Promise<GetPostCommentRdto[]> {
    const postComments = await this.postCommentService.getPostComments(postId);

    return postComments.map((comment) => {
      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        nickName: comment.user.nickName,
        handle: comment.user.handle,
        profileImageUrl: comment.user.profileImageUrl,
      };
    });
  }
}
