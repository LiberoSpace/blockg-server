import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePostMetadataDto } from './dtos/update-post-metadata.dto';
import { PostsService } from './posts.service';
import { GetPostRdto } from './rdtos/get-post.rdto';

@ApiTags('글 - public')
@Controller('blockg/public-api/v1/posts')
export class PostPublicController {
  constructor(private readonly postsService: PostsService) {}

  // @Get('')
  // async getPosts(): Promise<PostEntity[]> {
  //   return await this.postsService.findAll();
  // }

  @ApiOperation({
    summary: '글 상세 조회',
  })
  @ApiOkResponse({
    type: GetPostRdto,
  })
  @Get('/:postId')
  async getPost(
    @Param('postId')
    postId: number,
  ): Promise<GetPostRdto> {
    const post = await this.postsService.findOne(postId);
    if (!post) {
      throw new NotFoundException('글이 없습니다.');
    }
    return GetPostRdto.fromEntity(post);
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
    await this.postsService.updatePostMetadata(postId, dto);
  }
}
