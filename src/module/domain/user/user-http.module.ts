import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { UserController } from './controllers/user.controller';
import { UsersModule } from './user.module';
import { UserPublicController } from './controllers/user.public.controller';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [UserController, UserPublicController],
  providers: [],
})
export class UserHttpModule {}
