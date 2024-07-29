import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { TransactionTypeRole } from '../entity/statement.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatementDto {
  @ApiProperty({ description: 'User ID', example: '1' })
  @IsString()
  @IsNotEmpty()
  userID: string;

  @ApiProperty({ description: 'Description of the statement', example: 'Test' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Amount of the statement', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Date of the statement', example: '2023-01-01' })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'Type of the statement',
    example: TransactionTypeRole.ADDITION,
    enum: TransactionTypeRole,
  })
  @IsEnum(TransactionTypeRole)
  @IsNotEmpty()
  type: TransactionTypeRole;
}
