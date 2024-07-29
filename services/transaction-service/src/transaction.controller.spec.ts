/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionTypeRole } from './entity/transaction.entity';
import { BadRequestException } from '@nestjs/common';

// Mock do repositório
const mockTransactionRepository = {
  save: jest.fn().mockResolvedValue({}),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
};

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;
  let repository: Repository<Transaction>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    controller = moduleFixture.get<TransactionController>(
      TransactionController,
    );
    service = moduleFixture.get<TransactionService>(TransactionService);
    repository = moduleFixture.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new transaction', async () => {
    const createTransactionDto: CreateTransactionDto = {
      userID: 'user-id',
      description: 'Transaction description',
      amount: 100,
      date: new Date(),
      type: TransactionTypeRole.ADDITION,
    };
    jest
      .spyOn(service, 'create')
      .mockResolvedValue(createTransactionDto as any);

    const result = await controller.create(createTransactionDto);

    expect(result).toEqual(createTransactionDto);
    expect(service.create).toHaveBeenCalledWith(createTransactionDto);
  });

  it('should return a 400 error if the transaction already exists', async () => {
    const createTransactionDto: CreateTransactionDto = {
      userID: 'user-id',
      description: 'Transaction description',
      amount: 100,
      date: new Date(),
      type: TransactionTypeRole.ADDITION,
    };
    jest
      .spyOn(service, 'create')
      .mockRejectedValue(new BadRequestException('Transaction already exists'));

    try {
      await controller.create(createTransactionDto);
    } catch (error) {
      expect(JSON.stringify(error.response)).toBe(
        JSON.stringify({
          message: 'Transaction already exists',
          error: 'Bad Request',
          statusCode: 400,
        }),
      );
    }
  });

  it('should return all transactions for a user', async () => {
    const userId = 'user-id';
    const transactions = [
      {
        userID: 'user-id',
        description: 'Transaction description',
        amount: 100,
        date: new Date(),
        type: TransactionTypeRole.ADDITION,
      },
    ];
    jest.spyOn(service, 'findAll').mockResolvedValue(transactions as any);

    const result = await controller.findAll(userId);

    expect(result).toEqual(transactions);
    expect(service.findAll).toHaveBeenCalledWith(userId);
  });

  it('should return a 400 error if userID is not provided', async () => {
    try {
      await controller.findAll('');
    } catch (error) {
      expect(error.response).toBe('User ID must be provided');
    }
  });
});
