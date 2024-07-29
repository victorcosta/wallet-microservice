import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { TransactionTypeRole } from '../entity/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  userID: string;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Test transaction',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Amount of the transaction',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Date of the transaction',
    example: '2024-01-01T18:48:28.217Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'Type of the transaction',
    enum: TransactionTypeRole,
    example: TransactionTypeRole.ADDITION,
  })
  @IsEnum(TransactionTypeRole)
  @IsNotEmpty()
  type: TransactionTypeRole;
}
