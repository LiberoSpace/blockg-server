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
import { PostService } from '../post.service';
import { GetPostRdto } from './rdtos/get-post.rdto';

@ApiTags('글')
@Controller('blockg/public-api/v1/posts')
export class PostPublicController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '글 상세 조회',
  })
  @ApiOkResponse({
    type: GetPostRdto,
  })
  @Get('/:referenceId')
  async getPost(
    @Param('referenceId')
    referenceId: string,
  ): Promise<GetPostRdto> {
    const post = await this.postService.findOne(referenceId);
    if (!post) {
      throw new NotFoundException('글이 없습니다.');
    }
    return GetPostRdto.fromEntity({ post });
  }

  @ApiOperation({
    summary: '글 메타데이터 업데이트',
    description: '조회수 등의 업데이트를 위해 사용됨',
  })
  @Patch('/:referenceId')
  async updatePostMetadata(
    @Param('referenceId') referenceId: string,
    @Body() dto: UpdatePostMetadataDto,
  ) {
    await this.postService.updatePostMetadata(referenceId, dto);
  }
}
