import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
})
export class AuthHttpModule {}
