import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp with time zone')
  date: Date;

  @Column('jsonb')
  conversionRate: Record<string, number>;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;
}
