import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetPostRdto } from '../../post/controllers/rdtos/get-post.rdto';
import { PostService } from '../../post/services/post.service';
import { User } from '../entities/user.entity';
import { FirebaseAuthGuard } from '../../../../guards/firebase-auth.guard';

@ApiBearerAuth('JWT')
@UseGuards(FirebaseAuthGuard)
@ApiTags('유저 글')
@Controller('blockg/api/v1/users/:handle/posts')
export class UserPostController {
  constructor(private postService: PostService) {}

  @ApiOperation({
    summary: '비밀글을 위한 글 상세 조회',
  })
  @ApiOkResponse({
    type: GetPostRdto,
  })
  @Get('/:postNumber')
  async getPost(
    @Request() req: any,
    @Param('handle') handle: string,
    @Param('postNumber') postNumber: number,
  ): Promise<GetPostRdto> {
    const user: User = req.user;
    const post = await this.postService.findOne(handle, postNumber);
    if (!post) {
      throw new NotFoundException('글이 없습니다.');
    }
    if (user.id !== post.userId) {
      throw new ForbiddenException('글을 조회할 권한이 없습니다.');
    }
    return GetPostRdto.fromEntity({ post, isMine: true });
  }
}
