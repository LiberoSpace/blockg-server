import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostTagType } from '../enums/post-tag-type.enum';
import { Post } from './post.entity';

@Entity()
export class PostTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: PostTagType })
  tagType: PostTagType;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @ManyToOne(() => Post, (post) => post.postTags, { onDelete: 'CASCADE' })
  post: Post;
}
