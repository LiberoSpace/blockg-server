import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module';
import { PostLike } from './entities/post-like.entity';
import { Post } from './entities/post.entity';
import { PostLikeService } from './services/post-like.service';
import { PostService } from './services/post.service';
import { PostCommentService } from './services/post-comment.service';
import { PostComment } from './entities/post-comment.entity';
import { PostTag } from './entities/post-tag.entity';

@Module({
  imports: [
    ExchangeRateModule,
    TypeOrmModule.forFeature([Post, PostLike, PostComment, PostTag]),
  ],
  providers: [PostService, PostLikeService, PostCommentService],
  exports: [PostService, PostLikeService, PostCommentService],
})
export class PostModule {}
