import {
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
import { PostLikeService } from '../post-like.service';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@ApiBearerAuth('JWT')
@UseGuards(FirebaseAuthGuard)
@ApiTags('글 좋아요')
@Controller('blockg/api/v1/posts/:postId/likes')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @ApiOperation({
    summary: '글 좋아요 가져오기',
    description:
      '자신의 글 좋아요 식별자를 가져옵니다. 없으면 null을 반환합니다.',
  })
  @ApiOkResponse({
    description: '자신의 글 좋아요 식별자를 가져옴',
    type: Number,
  })
  @Get('/')
  async getPostLike(
    @Request() req: any,
    @Param('postId') postId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<number | null> {
    const user = req.user;
    const postLike = await this.postLikeService.getPostLike(postId, user);
    if (postLike === null) {
      return null;
    }
    return postLike.id;
  }

  @ApiOperation({
    summary: '글 좋아요하기',
  })
  @ApiOkResponse({
    description: '좋아요 id. 취소시 사용 가능',
    type: Number,
  })
  @Post('/')
  async createPostLike(
    @Request() req: any,
    @Param('postId') postId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<number> {
    const user = req.user;
    const postLikeId = await this.postLikeService
      .createPostLike(postId, user)
      .catch((e) => {
        if (e instanceof QueryFailedError) {
          if (e.driverError.code === '23505') {
            res.set('Allow', 'DELETE');
            throw new MethodNotAllowedException(
              '이미 좋아요를 누른 상태입니다.',
            );
          }
        }
        throw e; // 다른 에러는 그대로 전달
      });
    return postLikeId;
  }

  @ApiOperation({
    summary: '글 좋아요 취소하기',
  })
  @Delete('/:postLikeId')
  async deletePostLike(
    @Request() req: any,
    @Param('postLikeId') postLikeId: number,
  ) {
    const user: User = req.user;

    await this.postLikeService.deletePostLike(postLikeId, user);
  }
}
