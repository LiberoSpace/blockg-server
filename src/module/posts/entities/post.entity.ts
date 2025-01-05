import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  thumbnailImage: string;

  blockCount: number;

  @Column({ default: 0 })
  shareCount: number;

  @Exclude()
  @Column({ default: 0 })
  views: number;

  @Column()
  totalExpense: number;

  @Exclude()
  @Column({ default: false })
  published: boolean;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt?: Date;
}
