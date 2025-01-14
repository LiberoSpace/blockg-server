import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { User } from '../users/entities/user.entity';
import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module';

@Module({
  imports: [ExchangeRateModule, TypeOrmModule.forFeature([Post, User])],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
