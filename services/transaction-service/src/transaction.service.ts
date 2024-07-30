import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    // Verificação de duplicidade e criação da transação
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
    await this.emitTransactionCreatedEvent(newTransaction);
    return newTransaction;
  }

  async findAll(userID: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userID },
      order: { id: 'DESC' },
    });
  }

  async createBatch(createTransactionDtos: CreateTransactionDto[]) {
    // Publica o lote de transações no RabbitMQ
    const jobs = [];
    for (const createTransactionDto of createTransactionDtos) {
      jobs.push(
        this.amqpConnection.publish(
          process.env.TRANSACTION_PROCESS_QUEUE_EXCHANGE,
          process.env.TRANSACTION_PROCESS_QUEUE_ROUTING_KEY,
          createTransactionDto,
        ),
      );
    }
    await Promise.all(jobs);
  }

  async processTransaction(createTransactionDto: CreateTransactionDto) {
    // Processa cada transação recebida da fila
    return this.create(createTransactionDto);
  }

  private async emitTransactionCreatedEvent(transaction: Transaction) {
    // Publica eventos para outros serviços
    await this.amqpConnection.publish(
      process.env.UPDATE_STATEMENT_EXCHANGE,
      process.env.RABBITMQ_ROUTING_KEY_CREATED,
      transaction,
    );
  }
}
