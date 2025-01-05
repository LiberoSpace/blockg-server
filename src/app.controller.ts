import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './guards/auth.guard';

@Controller()
export class AppController {
  constructor() { }

  @Get()
  getHello(): string {
    return 'Hello Blockg Server';
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('id-token-test')
  idTokenTest(): string {
    return 'Success';
  }
}
