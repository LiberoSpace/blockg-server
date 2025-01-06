import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@Controller('blockg/public-api/v1/users')
@ApiTags('유저 - public')
export class UsersPublicController {
  constructor(private UsersService: UsersService) {}

  // @ApiOperation({
  //   summary: '유저 상세 조회',
  // })
  // @Get('/:handle')
  // async getUser(@Param('handle') handle: string) {
  //   await this.UsersService.getUser({ handle: handle });
  // }
}
