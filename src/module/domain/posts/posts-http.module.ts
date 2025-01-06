import { Module } from '@nestjs/common';
import { AuthModule } from '../users/auth.module';
import { PostSubscriber } from './post-subscriber';
import { PostsController } from './posts.controller';
import { PostsModule } from './posts.module';
import { PostPublicController } from './posts.public.controller';

@Module({
  imports: [AuthModule, PostsModule],
  providers: [PostSubscriber],
  controllers: [PostsController, PostPublicController],
})
export class PostsHttpModule {}
