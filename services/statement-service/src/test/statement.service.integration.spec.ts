/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StatementModule } from '../statement.module';
import { StatementService } from '../statement.service';
import { Statement, TransactionTypeRole } from '../entity/statement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule } from '@nestjs/config';

describe('StatementService (integration)', () => {
  let app: INestApplication;
  let statementRepository: Repository<Statement>;

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
        TypeOrmModule.forFeature([Statement]),
        StatementModule,
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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    statementRepository = moduleFixture.get<Repository<Statement>>(
      getRepositoryToken(Statement),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST statement (create a new statement)', async () => {
    const createStatementDto = {
      userID: '1',
      description: 'Test Statement',
      amount: 100,
      date: new Date(),
      type: TransactionTypeRole.ADDITION,
    };

    return request(app.getHttpServer())
      .post('/statements')
      .send(createStatementDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.userID).toEqual('1');
        expect(response.body.description).toEqual('Test Statement');
        expect(response.body.amount).toEqual(100);
      });
  });

  it('/GET statements/:userID (get all statements for a user)', async () => {
    const userID = '1';

    return request(app.getHttpServer())
      .get(`/statements/${userID}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        response.body.forEach((statement) => {
          expect(statement.userID).toEqual(userID);
        });
      });
  });

  it('/GET statements/balance/:userID (get balance for a user)', async () => {
    const userID = '1';

    return request(app.getHttpServer())
      .get(`/statements/balance/${userID}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeDefined();
      });
  });
});
