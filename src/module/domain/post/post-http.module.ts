import { Module } from '@nestjs/common';
import { AuthModule } from '../user/auth.module';
import { PostSubscriber } from './post-subscriber';
import { PostController } from './apis/post.controller';
import { PostModule } from './post.module';
import { PostPublicController } from './apis/post.public.controller';
import { PostLikeController } from './apis/post-like.controller';

@Module({
  imports: [AuthModule, PostModule],
  providers: [PostSubscriber],
  controllers: [PostController, PostPublicController, PostLikeController],
})
export class PostHttpModule {}
