import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionModule } from '../transaction.module';
import { TransactionService } from '../transaction.service';
import { Transaction } from '../entity/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule } from '@nestjs/config';

describe('TransactionService (integration)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let transactionRepository: Repository<Transaction>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT, 10),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Transaction]),
        TransactionModule,
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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    transactionRepository = moduleFixture.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST transactions (create a new transaction)', async () => {
    const createTransactionDto = {
      userID: '1',
      description: 'Test Transaction',
      amount: 100,
      date: new Date(),
      type: 'ADDITION',
    };

    return request(app.getHttpServer())
      .post('/transactions')
      .send(createTransactionDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.userID).toEqual('1');
        expect(response.body.description).toEqual('Test Transaction');
        expect(response.body.amount).toEqual(100);
      });
  });

  it('/GET transactions/:userID (get all transactions for a user)', async () => {
    const userID = '1';

    return request(app.getHttpServer())
      .get(`/transactions/${userID}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        response.body.forEach((transaction) => {
          expect(transaction.userID).toEqual(userID);
        });
      });
  });
});
