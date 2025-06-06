import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PostStatus } from '../enums/post-status.enum';
import { Block } from './block.entity';
import { PostLike } from './post-like.entity';
import { PostComment } from './post-comment.entity';
import { PostTag } from './post-tag.entity';

@Unique('user_id_post_number_uk', ['userId', 'postNumber'])
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postNumber: number;

  @Column({ nullable: true })
  title: string;

  @Column('character varying', { nullable: true })
  thumbnailUrl: string | null;

  @Column('character varying', { nullable: true })
  thumbnailText: string | null;

  @Column({ default: 0 })
  blockCount: number;

  @Column({ default: 0 })
  shareCount: number;

  @Column({ default: 0 })
  views: number;

  @Column('integer', { nullable: true })
  totalExpense: number | null;

  @Column('enum', { enum: PostStatus, default: PostStatus.TEMPORARY })
  status: PostStatus;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @Column({
    nullable: true,
    type: 'timestamp with time zone',
  })
  publishedAt: Date;

  // 조회수 증가에서도 업데이트 됨.
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @Column('json', { nullable: true })
  content: Block[];

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @Column('smallint', { nullable: true })
  curationNumber?: number;

  @Column('text', { array: true, nullable: true })
  countries?: string[] | null;

  @Column('text', { array: true, nullable: true })
  cities?: string[] | null;

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes: PostLike[];

  @OneToMany(() => PostComment, (postComment) => postComment.post)
  postComments: PostComment[];

  @OneToMany(() => PostTag, (postTag) => postTag.post)
  postTags: PostTag[];

  likeCount: number;
  commentCount: number;
}
