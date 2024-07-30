import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionTypeRole {
  ADDITION = 'ADDITION',
  WITHDRAW = 'WITHDRAW',
  PURCHASE = 'PURCHASE',
  CANCELLATION = 'CANCELLATION',
  REVERSAL = 'REVERSAL',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The ID of the Transaction',
    example: '1',
  })
  id: number;

  @Column()
  @ApiProperty({
    description: 'The ID of the user',
    example: '2',
  })
  userID: string;

  @Column()
  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Test transaction',
  })
  description: string;

  @Column('decimal')
  @ApiProperty({
    description: 'Amount of the transaction',
    example: 100,
  })
  amount: number;

  @Column()
  @ApiProperty({
    description: 'Date of the transaction',
    example: '2024-01-01T18:48:28.217Z',
  })
  date: Date;

  @Column({
    type: 'enum',
    enum: TransactionTypeRole,
  })
  @ApiProperty({
    description: 'Type of the transaction',
    enum: TransactionTypeRole,
    example: TransactionTypeRole.ADDITION,
  })
  type: TransactionTypeRole;
}
