import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatementService } from './statement.service';
import { StatementController } from './statement.controller';
import { Statement } from './entity/statement.entity';
import { RabbitMQModule, AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statement]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: process.env.UPDATE_STATEMENT_EXCHANGE,
          type: 'direct',
        },
      ],
      uri: process.env.RABBITMQ_URI,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [StatementService],
  controllers: [StatementController],
})
export class StatementModule {
  constructor(
    private readonly statementService: StatementService,
    private readonly amqpConnection: AmqpConnection,
  ) {
    this.amqpConnection.createSubscriber(
      this.statementService.handleTransactionCreated.bind(
        this.statementService,
      ),
      {
        exchange: process.env.UPDATE_STATEMENT_EXCHANGE,
        queue: process.env.UPDATE_STATEMENT_QUEUE,
        routingKey: process.env.RABBITMQ_ROUTING_KEY,
      },
      'handleTransactionCreated',
    );
  }
}
