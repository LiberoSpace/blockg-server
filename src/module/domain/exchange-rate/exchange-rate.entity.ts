import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp with time zone')
  date: Date;

  @Column('jsonb')
  conversionRate: Record<string, number>;
}
