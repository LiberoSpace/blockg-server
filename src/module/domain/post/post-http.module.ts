import { Module } from '@nestjs/common';
import { AuthModule } from '../user/auth.module';
import { PostSubscriber } from './post-subscriber';
import { PostController } from './controllers/post.controller';
import { PostModule } from './post.module';
import { PostPublicController } from './controllers/post.public.controller';
import { PostLikeController } from './controllers/post-like.controller';
import { PostSchedulerController } from './controllers/post.scheduler.controller';
import { GcpModule } from '../../gcp/gcp.module';
import { PostCommentController } from './controllers/post-comment.controller';
import { PostCommentPublicController } from './controllers/post-comment.public.controller';
import { PostInternalController } from './controllers/post.internal.controller';

@Module({
  imports: [AuthModule, PostModule, GcpModule],
  providers: [PostSubscriber],
  controllers: [
    PostController,
    PostPublicController,
    PostLikeController,
    PostSchedulerController,
    PostCommentController,
    PostCommentPublicController,
    PostInternalController,
  ],
})
export class PostHttpModule {}
