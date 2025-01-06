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
import { UsersService } from './users.service';

@ApiBearerAuth('JWT')
@UseGuards(FirebaseAuthGuard)
@ApiTags('유저')
@Controller('blockg/api/v1/users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @ApiOperation({
    summary: '자기 정보 상세 조회',
  })
  @Get('/:handle')
  async getUser(@Request() req: any, @Param('handle') handle: string) {
    if (req.user.handle != handle) {
      throw new ForbiddenException('자신의 정보를 조회하지 않았습니다.');
    }
    await this.UsersService.getUser({ handle });
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
  ): Promise<Number> {
    const user = req.user;
    return await this.UsersService.createUser(user.uid, dto);
  }
}
