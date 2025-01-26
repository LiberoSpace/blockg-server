import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { PostService } from '../../post/services/post.service';
import { GetUserRdto } from './rdtos/get-user.rdto';
import { AuthService } from '../services/auth.service';

@Controller('blockg/public-api/v1/users')
@ApiTags('유저')
export class UserPublicController {
  constructor(
    private userService: UserService,
    private postService: PostService,
    private authService: AuthService,
  ) {}

  @ApiOperation({
    summary: '유저 상세 조회',
  })
  @ApiOkResponse({
    type: GetUserRdto,
  })
  @Get('/:handle')
  async getUser(@Param('handle') handle: string): Promise<GetUserRdto> {
    const user = await this.userService.getUser({ handle: handle });
    const statistics = await this.authService.getUserStatistics(user);
    const postTagTypeCounts = await this.postService.getUserPostTagsStatistics(
      user.id,
    );
    return GetUserRdto.fromUser(user, statistics, postTagTypeCounts);
  }
}
