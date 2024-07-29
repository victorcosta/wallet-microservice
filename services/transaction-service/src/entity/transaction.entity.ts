import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionTypeRole {
  ADDITION = 'ADDITION',
  WITHDRAWAL = 'WITHDRAWAL',
  PURCHASE = 'PURCHASE',
  CANCELLATION = 'CANCELLATION',
  REVERSAL = 'REVERSAL',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userID: string;

  @Column()
  description: string;

  @Column('decimal')
  amount: number;

  @Column()
  date: Date;

  @Column({
    type: 'enum',
    enum: TransactionTypeRole,
  })
  type: TransactionTypeRole;
}
