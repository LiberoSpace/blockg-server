import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../../../../guards/firebase-auth.guard';
import { UserService } from '../services/user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiBearerAuth('JWT')
@UseGuards(FirebaseAuthGuard)
@ApiTags('유저')
@Controller('blockg/api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: '자기 정보 상세 조회',
  })
  @Get('/:handle')
  async getUser(@Request() req: any, @Param('handle') handle: string) {
    if (req.user.handle != handle) {
      throw new ForbiddenException('자신의 정보를 조회하지 않았습니다.');
    }
    await this.userService.getUser({ handle });
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
    return await this.userService.createUser(user.uid, dto);
  }

  @ApiOperation({
    summary: '자신의 유저 정보 수정',
  })
  @ApiNoContentResponse({
    description: '정보 수정 완료.',
  })
  @Patch('/me')
  async updateUser(@Request() req: any, @Body() dto: UpdateUserDto) {
    const user = req.user;
    await this.userService.updateUser(user, dto);
  }

  @ApiOperation({
    summary: '탈퇴하기',
    description: '인증, 스토리지, DB 등. 유저와 관련된 모든 데이터 삭제',
  })
  @ApiNoContentResponse({
    description: '삭제 완료.',
  })
  @Delete('/me')
  async deleteUser(
    @Request() req: any,
    @Query('token') googleAuthToken: string,
  ) {
    const user = req.user;
    await this.userService.deleteUser(user, googleAuthToken);
  }
}
