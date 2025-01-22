import { PostComment } from '../../post/entities/post-comment.entity';
import { PostLike } from '../../post/entities/post-like.entity';
import { Post } from '../../post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique('user_uid_uc', ['uid'])
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column()
  email: string;

  @Column()
  nickName: string;

  @Column()
  handle: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLikes: PostLike[];

  @OneToMany(() => PostComment, (postComment) => postComment.user)
  postComments: PostComment[];
}
