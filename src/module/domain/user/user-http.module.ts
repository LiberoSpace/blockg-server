import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { UserController } from './controllers/user.controller';
import { UsersModule } from './user.module';
import { UserPublicController } from './controllers/user.public.controller';
import { PostModule } from '../post/post.module';

@Module({
  imports: [AuthModule, UsersModule, PostModule],
  controllers: [UserController, UserPublicController],
  providers: [],
})
export class UserHttpModule {}
