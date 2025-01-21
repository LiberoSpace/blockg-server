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
      .addSelect('CAST(SUM(post.views) AS integer)', 'postViews')
      .addSelect('CAST(SUM(post.blockCount) AS integer)', 'blockCount')
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
  @ViewColumn({
    transformer: {
      to(value: any) {},
      from(value: number | null): number {
        return value ?? 0;
      },
    },
  })
  postViews: number;

  @ApiProperty({
    description: '블록 수 합',
  })
  @ViewColumn({
    transformer: {
      to(value: any) {},
      from(value: number | null): number {
        return value ?? 0;
      },
    },
  })
  blockCount: number;
}
