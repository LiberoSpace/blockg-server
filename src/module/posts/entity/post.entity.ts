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
  content: string;

  @Column({ default: 0 })
  views: number;

  @Exclude()
  @Column({ default: 0 })
  sharedCount: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt?: Date;
}
