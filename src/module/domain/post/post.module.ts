import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module';
import { PostLike } from './entities/post-like.entity';
import { Post } from './entities/post.entity';
import { PostLikeService } from './post-like.service';
import { PostService } from './post.service';

@Module({
  imports: [ExchangeRateModule, TypeOrmModule.forFeature([Post, PostLike])],
  providers: [PostService, PostLikeService],
  exports: [PostService, PostLikeService],
})
export class PostModule {}
