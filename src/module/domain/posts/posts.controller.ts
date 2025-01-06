import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Post as PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';
import { FirebaseAuthGuard } from '../../../guards/firebase-auth.guard';

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
  @Post('/')
  async createPost(@Request() req: any): Promise<Number> {
    const user = req.user;
    return await this.postsService.createPost(user.id);
  }

  // @Put('/:postId')
  // async overwritePost() {}
}
