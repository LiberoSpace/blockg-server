import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  exports: [TypeOrmModule],
})
export class PostsModule {}
