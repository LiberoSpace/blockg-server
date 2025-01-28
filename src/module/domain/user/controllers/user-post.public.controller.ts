import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPostRdto } from '../../post/controllers/rdtos/get-post.rdto';
import { PostService } from '../../post/services/post.service';
import { GetPostsRdto } from '../../post/controllers/rdtos/get-posts.rdto';
import { GetPostsDto } from '../../post/controllers/dtos/get-posts.dto';

@Controller('blockg/public-api/v1/users/:handle/posts')
@ApiTags('유저 글')
export class UserPostPublicController {
  constructor(private postService: PostService) {}

  @ApiOperation({
    summary: '유저 글 목록 조회',
  })
  @ApiOkResponse({
    type: GetPostsRdto,
  })
  @Get('')
  async getPosts(
    @Param('handle') handle: string,
    @Query() dto: GetPostsDto,
  ): Promise<GetPostsRdto> {
    const postPage = await this.postService.findPage(dto, handle);
    return GetPostsRdto.fromPage(postPage);
  }

  @ApiOperation({
    summary: '유저의 글 상세 조회',
  })
  @ApiOkResponse({
    type: GetPostRdto,
  })
  @Get('/:postNumber')
  async getUser(
    @Param('handle') handle: string,
    @Param('postNumber') postNumber: number,
  ): Promise<GetPostRdto> {
    const post = await this.postService.findOne(handle, postNumber);
    if (!post) {
      throw new NotFoundException('글이 없습니다.');
    }
    return GetPostRdto.fromEntity({ post });
  }
}
