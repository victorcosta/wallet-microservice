import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entity/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: process.env.TRANSACTION_PROCESS_QUEUE_EXCHANGE,
          type: 'direct',
        },
        {
          name: process.env.UPDATE_STATEMENT_EXCHANGE,
          type: 'direct',
        },
      ],
      uri: process.env.RABBITMQ_URI,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly amqpConnection: AmqpConnection,
  ) {
    this.amqpConnection.createSubscriber(
      this.transactionService.processTransaction.bind(this.transactionService),
      {
        exchange: process.env.TRANSACTION_PROCESS_QUEUE_EXCHANGE,
        queue: process.env.TRANSACTION_PROCESS_QUEUE_NAME,
        routingKey: process.env.TRANSACTION_PROCESS_QUEUE_ROUTING_KEY,
      },
      'processTransaction',
    );
  }
}
