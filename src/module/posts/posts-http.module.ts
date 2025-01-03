import { Module } from '@nestjs/common';
import { PostsModule } from './posts.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostSubscriber } from './post-subscriber';

@Module({
  imports: [PostsModule],
  providers: [PostsService, PostSubscriber],
  controllers: [PostsController],
})
export class PostsHttpModule {}
