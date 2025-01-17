import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../../../guards/firebase-auth.guard';
import { User } from './entities/user.entity';
import { GetMeRdto } from './rdtos/get-me.rdto';

@ApiBearerAuth('JWT')
@UseGuards(FirebaseAuthGuard)
@ApiTags('인증')
@Controller('blockg/api/v1/auth')
export class AuthController {
  constructor() {}

  @ApiOperation({
    summary: '자기 정보 상세 조회',
  })
  @ApiOkResponse({
    type: GetMeRdto,
  })
  @Get('/me')
  async getMe(@Request() req: any): Promise<GetMeRdto> {
    const user: User = req.user;
    return GetMeRdto.fromUser(user);
  }
}
