import { Module } from '@nestjs/common';
import { AuthModule } from '../user/auth.module';
import { PostSubscriber } from './post-subscriber';
import { PostController } from './apis/post.controller';
import { PostModule } from './post.module';
import { PostPublicController } from './apis/post.public.controller';
import { PostLikeController } from './apis/post-like.controller';
import { PostSchedulerController } from './apis/post.scheduler.controller';
import { GcpModule } from 'src/module/gcp/gcp.module';

@Module({
  imports: [AuthModule, PostModule, GcpModule],
  providers: [PostSubscriber],
  controllers: [
    PostController,
    PostPublicController,
    PostLikeController,
    PostSchedulerController,
  ],
})
export class PostHttpModule {}
