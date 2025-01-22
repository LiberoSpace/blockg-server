import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from './post.entity';

@Entity()
export class PostComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.postLikes, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Post, (post) => post.postLikes, { onDelete: 'CASCADE' })
  post: Post;

  @Column()
  postId: number;
}
