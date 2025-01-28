import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostService } from '../services/post.service';
import { GetPostsDto } from './dtos/get-posts.dto';
import { UpdatePostMetadataDto } from './dtos/update-post-metadata.dto';
import { GetPostsRdto } from './rdtos/get-posts.rdto';

@ApiTags('글')
@Controller('blockg/public-api/v1/posts')
export class PostPublicController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '글 목록 조회',
  })
  @ApiOkResponse({
    type: GetPostsRdto,
  })
  @Get('/')
  async getPosts(@Query() dto: GetPostsDto): Promise<GetPostsRdto> {
    const postPage = await this.postService.findPage(dto);
    return GetPostsRdto.fromPage(postPage);
  }

  @ApiOperation({
    summary: '글 메타데이터 업데이트',
    description: '조회수 등의 업데이트를 위해 사용됨',
  })
  @Patch('/:postId')
  async updatePostMetadata(
    @Param('postId') postId: number,
    @Body() dto: UpdatePostMetadataDto,
  ) {
    await this.postService.updatePostMetadata(postId, dto);
  }
}
