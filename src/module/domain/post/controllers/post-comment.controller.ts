import {
  Body,
  Controller,
  Delete,
  Get,
  MethodNotAllowedException,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../../../../guards/firebase-auth.guard';
import { User } from '../../user/entities/user.entity';
import { PostCommentService } from '../services/post-comment.service';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { CreatePostCommentDto } from './dtos/create-post-comment.dto';
import { GetPostCommentRdto } from './rdtos/get-post-comments.rdto';

@ApiBearerAuth('JWT')
@UseGuards(FirebaseAuthGuard)
@ApiTags('글 댓글')
@Controller('blockg/api/v1/posts/:postId/comments')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  @ApiOperation({
    summary: '댓글 작성하기',
  })
  @ApiOkResponse({
    description: '댓글 id. 삭제시에 사용 가능',
    type: Number,
  })
  @Post('')
  async createPostComment(
    @Request() req: any,
    @Param('postId') postId: number,
    @Body() dto: CreatePostCommentDto,
  ): Promise<number> {
    const user = req.user;
    const postCommentId = await this.postCommentService.createPostComment(
      { postId, content: dto.content },
      user,
    );

    return postCommentId;
  }

  @ApiOperation({
    summary: '댓글 삭제하기',
  })
  @Delete('/:postCommentId')
  async deletePostComment(
    @Request() req: any,
    @Param('postId') postId: number,
    @Param('postCommentId') postCommentId: number,
  ) {
    const user: User = req.user;

    await this.postCommentService.deletePostComment(
      { postId, postCommentId },
      user,
    );
  }
}
