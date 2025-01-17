import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../../../../guards/firebase-auth.guard';
import { PostService } from '../post.service';
import { UpdatePostDto } from './dtos/update-post.dto';
import { User } from '../../user/entities/user.entity';
import { PostStatus } from '../enums/post-status.enum';

@ApiBearerAuth('JWT')
@UseGuards(FirebaseAuthGuard)
@ApiTags('글')
@Controller('blockg/api/v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '글 생성하기.',
    description: 'postId 이용을 위해 사용됨',
  })
  @ApiOkResponse({
    description: 'id, referenceId로 구성된 객체',
    type: Object,
  })
  @Post('/')
  async createPost(@Request() req: any): Promise<{
    id: number;
    referenceId: string;
  }> {
    const user = req.user;
    const post = await this.postService.createPost(user.id);
    return {
      id: post.id,
      referenceId: post.referenceId,
    };
  }

  @ApiOperation({
    summary: '글 정보 업데이트하기',
    description: '글 전반의 내용을 업데이트합니다.',
  })
  @Patch('/:postId')
  async updatePost(
    @Request() req: any,
    @Param('postId') postId: number,
    @Body() dto: UpdatePostDto,
  ) {
    const user: User = req.user;

    if (dto.status === PostStatus.TEMPORARY) {
      throw new BadRequestException(
        '임시 상태로는 글을 업데이트할 수 없습니다.',
      );
    }
    await this.postService.updatePost(postId, user.id, dto);
  }

  @ApiOperation({
    summary: '글 삭제하기',
  })
  @Delete('/:postId')
  async deletePost(@Request() req: any, @Param('postId') postId: number) {
    const user: User = req.user;

    await this.postService.deletePost(postId, user.id);
  }
}
