import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import axios from 'axios';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const existingTransaction = await this.transactionRepository.findOne({
      where: {
        userID: createTransactionDto.userID,
        description: createTransactionDto.description,
        amount: createTransactionDto.amount,
        date: createTransactionDto.date,
        type: createTransactionDto.type,
      },
    });

    if (existingTransaction) {
      throw new Error('Duplicate transaction');
    }

    const newTransaction =
      this.transactionRepository.create(createTransactionDto);
    await this.transactionRepository.save(newTransaction);
    await this.updateStatementService(newTransaction);

    return newTransaction;
  }

  async findAll(userID: string): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find({
      where: {
        userID: userID,
      },
      order: {
        date: 'DESC',
      },
    });
    return transactions;
  }

  private async updateStatementService(transaction: Transaction) {
    await axios.post(process.env.UPDATE_STATEMENT_URL, transaction);
  }
}
