import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PostStatus } from '../enums/post-status.enum';
import { Block } from './block.entity';

// @Index('reference_id_index', ['referenceId'])
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  // referenceId: string; // 기본적으로 UUID 생성

  @Column({ nullable: true })
  title: string;

  @Column('character varying', { nullable: true })
  thumbnailUrl: string | null;

  @Column({ default: 0 })
  blockCount: number;

  @Column({ default: 0 })
  shareCount: number;

  @Exclude()
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
}
