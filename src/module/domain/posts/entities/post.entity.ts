import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: 0 })
  blockCount: number;

  @Column({ default: 0 })
  shareCount: number;

  @Exclude()
  @Column({ default: 0 })
  views: number;

  @Column({ nullable: true })
  totalExpense: number;

  @Column({ default: false })
  published: boolean;

  @Exclude()
  @Column({ default: true })
  temporary: boolean;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @Column('json', { nullable: true })
  content: JSON;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;
}
