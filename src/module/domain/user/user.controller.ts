import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../../../guards/firebase-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

@ApiBearerAuth('JWT')
@UseGuards(FirebaseAuthGuard)
@ApiTags('유저')
@Controller('blockg/api/v1/users')
export class UserController {
  constructor(private UserService: UserService) {}

  @ApiOperation({
    summary: '자기 정보 상세 조회',
  })
  @Get('/:handle')
  async getUser(@Request() req: any, @Param('handle') handle: string) {
    if (req.user.handle != handle) {
      throw new ForbiddenException('자신의 정보를 조회하지 않았습니다.');
    }
    await this.UserService.getUser({ handle });
  }

  @ApiOperation({
    summary: '유저 생성',
  })
  @ApiOkResponse({
    description: 'id값',
    type: Number,
  })
  @Post('/')
  async createUser(
    @Request() req: any,
    @Body() dto: CreateUserDto,
  ): Promise<number> {
    const user = req.user;
    return await this.UserService.createUser(user.uid, dto);
  }
}
