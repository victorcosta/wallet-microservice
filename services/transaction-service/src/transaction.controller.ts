import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entity/transaction.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
    type: Transaction,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateTransactionDto })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.create(createTransactionDto);
  }

  @Get(':userID')
  @ApiOperation({ summary: 'Get all transactions of the user' })
  @ApiResponse({
    status: 200,
    description: 'Return all transactions for a user.',
    type: [Transaction],
    example: [
      {
        userID: '1',
        description: 'Test transaction',
        amount: 100,
        date: '2023-01-01',
        type: 'ADDITION',
      },
    ],
  })
  @ApiParam({
    name: 'userID',
    required: true,
    type: String,
    description: 'User ID to filter transactions.',
  })
  async findAll(@Param('userID') userID: string): Promise<Transaction[]> {
    return this.transactionService.findAll(userID);
  }
}
