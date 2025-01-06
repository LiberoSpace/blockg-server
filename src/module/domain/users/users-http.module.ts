import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { UsersPublicController } from './users.public.controller';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [UsersController, UsersPublicController],
  providers: [],
})
export class UsersHttpModule {}
