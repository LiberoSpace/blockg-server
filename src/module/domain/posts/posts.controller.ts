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
import { FirebaseAuthGuard } from '../../../guards/firebase-auth.guard';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dtos/update-post.dto';
import { User } from '../users/entities/user.entity';
import { PostStatus } from './enums/post-status.enum';

@ApiBearerAuth('JWT')
@UseGuards(FirebaseAuthGuard)
@ApiTags('글')
@Controller('blockg/api/v1/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @Get('')
  // async getPosts(): Promise<PostEntity[]> {
  //   return await this.postsService.findAll();
  // }

  // @Get('/:id')
  // async getPost(
  //   @Param('id')
  //   id: number,
  // ): Promise<PostEntity | null> {
  //   return await this.postsService.findOne(id);
  // }

  // @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: '글 생성하기.',
    description: 'postId 이용을 위해 사용됨',
  })
  @ApiOkResponse({
    description: '생성된 글 번호',
    type: Number,
  })
  @Post('/')
  async createPost(@Request() req: any): Promise<number> {
    const user = req.user;
    return await this.postsService.createPost(user.id);
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
    await this.postsService.updatePost(postId, user.id, dto);
  }

  @ApiOperation({
    summary: '글 삭제하기',
  })
  @Delete('/:postId')
  async deletePost(@Request() req: any, @Param('postId') postId: number) {
    const user: User = req.user;

    await this.postsService.deletePost(postId, user.id);
  }
}
