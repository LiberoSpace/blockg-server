import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InternalGuard } from '../../../../guards/internal.guard';
import { PostService } from '../services/post.service';
import { GetPostsDto } from './dtos/get-posts.dto';
import { GetPostsRdto } from './rdtos/get-posts.rdto';

@UseGuards(InternalGuard)
@ApiTags('내부 API')
@Controller('blockg/internal-api/v1/posts')
export class PostInternalController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '검색엔진용 글 목록 조회',
  })
  @ApiOkResponse({
    type: GetPostsRdto,
  })
  @Get('/')
  async getPosts(@Query() dto: GetPostsDto): Promise<GetPostsRdto> {
    const postPage = await this.postService.findPage(dto);
    return GetPostsRdto.fromPage(postPage);
  }
}
