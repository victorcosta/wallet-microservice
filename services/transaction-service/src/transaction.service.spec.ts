import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionTypeRole } from './entity/transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { jest } from '@jest/globals';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction and update statement service', async () => {
      const createTransactionDto: CreateTransactionDto = {
        userID: '1',
        description: 'Test transaction',
        amount: 100,
        date: new Date(),
        type: TransactionTypeRole.ADDITION,
      };

      const newTransaction: Transaction = {
        id: 1,
        ...createTransactionDto,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(newTransaction as any);
      jest.spyOn(repository, 'save').mockResolvedValue(newTransaction as any);

      // spy call to axios.post
      const updateStatementServiceSpy = jest
        .spyOn(service as any, 'updateStatementService')
        .mockResolvedValue(undefined);

      const result = await service.create(createTransactionDto);

      expect(result).toEqual(newTransaction);
      expect(updateStatementServiceSpy).toHaveBeenCalledWith(newTransaction);
    });

    it('should throw an error if transaction already exists', async () => {
      const createTransactionDto: CreateTransactionDto = {
        userID: '1',
        description: 'Test transaction',
        amount: 100,
        date: new Date(),
        type: TransactionTypeRole.ADDITION,
      };

      const existingTransaction: Transaction = {
        id: 1,
        ...createTransactionDto,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingTransaction);

      await expect(service.create(createTransactionDto)).rejects.toThrowError(
        'Duplicate transaction',
      );
    });
  });

  describe('findAll', () => {
    it('should return all transactions for a user', async () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          userID: '1',
          description: 'Test transaction',
          amount: 100,
          date: new Date(),
          type: TransactionTypeRole.ADDITION,
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(transactions);

      const result = await service.findAll('1');
      expect(result).toEqual(transactions);
    });
  });
});
