import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { UserController } from './controllers/user.controller';
import { UsersModule } from './user.module';
import { UserPublicController } from './controllers/user.public.controller';
import { PostModule } from '../post/post.module';
import { UserPostController } from './controllers/user-post.controller';
import { UserPostPublicController } from './controllers/user-post.public.controller';

@Module({
  imports: [AuthModule, UsersModule, PostModule],
  controllers: [
    UserController,
    UserPublicController,
    UserPostController,
    UserPostPublicController,
  ],
  providers: [],
})
export class UserHttpModule {}
