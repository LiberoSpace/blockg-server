import { ViewEntity, ViewColumn, DataSource } from 'typeorm';
import { User } from './user.entity';
import { Post } from '../../post/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('user.id', 'userId')
      .addSelect('SUM(post.views)', 'postViews')
      .addSelect('SUM(post.blockCount)', 'blockCount')
      .from(User, 'user')
      .leftJoin(Post, 'post', 'user.id = post.userId')
      .groupBy('user.id'),
})
export class UserStatistics {
  @Exclude()
  @ViewColumn()
  userId: number;

  @ApiProperty({
    description: '글 조회수 합',
  })
  @ViewColumn()
  postViews: number;

  @ApiProperty({
    description: '블록 수 합',
  })
  @ViewColumn()
  blockCount: number;
}
