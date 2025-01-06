import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';

@ApiTags('글 - public')
@Controller('blockg/public-api/v1/posts')
export class PostPublicController {
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

  @Patch('/:postId')
  async updatePost(
    @Param('postId') postId: number,
    @Body() dto: UpdatePostDto,
  ) {
    const updateResult = await this.postsService.updatePost(postId, dto);
  }
}
