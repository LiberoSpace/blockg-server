import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePostMetadataDto } from './dtos/update-post-metadata.dto';
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

  @ApiOperation({
    summary: '글 메타데이터 업데이트',
    description: '조회수 등의 업데이트를 위해 사용됨',
  })
  @Patch('/:postId')
  async updatePostMetadata(
    @Param('postId') postId: number,
    @Body() dto: UpdatePostMetadataDto,
  ) {
    const updateResult = await this.postsService.updatePostMetadata(
      postId,
      dto,
    );
  }
}
