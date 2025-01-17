import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('blockg/public-api/v1/users')
@ApiTags('유저')
export class UserPublicController {
  constructor(private UserService: UserService) {}

  @ApiOperation({
    summary: '유저 상세 조회',
  })
  @Get('/:handle')
  async getUser(@Param('handle') handle: string) {
    await this.UserService.getUser({ handle: handle });
  }
}
