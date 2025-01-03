import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './entity/post.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('')
  async getPosts(): Promise<PostEntity[]> {
    return await this.postsService.findAll();
  }

  @Get('/:id')
  async getPost(
    @Param('id')
    id: number,
  ): Promise<PostEntity | null> {
    return await this.postsService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/')
  async createPost(
    @Body()
    body: CreatePostDto,
  ): Promise<PostEntity> {
    return await this.postsService.save({
      content: body.content,
    });
  }
}
