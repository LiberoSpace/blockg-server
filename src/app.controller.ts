import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello Blockg Server';
  }
}
