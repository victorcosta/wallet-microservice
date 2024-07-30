import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction, TransactionTypeRole } from './entity/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;
  let amqpConnection: AmqpConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(), // Ensure the 'find' method is mocked
          },
        },
        {
          provide: AmqpConnection,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createDto: CreateTransactionDto = {
        userID: '1',
        description: 'Test transaction',
        amount: 100,
        date: new Date(),
        type: TransactionTypeRole.ADDITION,
      };

      const transactionMock: Transaction = {
        ...createDto,
        id: 1, // Assuming an ID for the mock
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'create').mockReturnValue(transactionMock);
      jest.spyOn(repository, 'save').mockResolvedValue(transactionMock);

      const result = await service.create(createDto);
      expect(repository.save).toHaveBeenCalledWith(transactionMock);
      expect(result).toEqual(transactionMock);
      expect(amqpConnection.publish).toHaveBeenCalled();
    });

    it('should throw an error if transaction exists', async () => {
      const createDto: CreateTransactionDto = {
        userID: '1',
        description: 'Test transaction',
        amount: 100,
        date: new Date(),
        type: TransactionTypeRole.ADDITION,
      };

      const transactionMock: Transaction = {
        ...createDto,
        id: 1, // Providing the necessary ID for the transaction
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(transactionMock);

      await expect(service.create(createDto)).rejects.toThrow(
        'Duplicate transaction',
      );
    });
  });

  describe('createBatch', () => {
    it('should publish each transaction in the batch', async () => {
      const transactions: CreateTransactionDto[] = [
        {
          userID: '1',
          description: 'Test transaction 1',
          amount: 100,
          date: new Date(),
          type: TransactionTypeRole.ADDITION,
        },
        {
          userID: '2',
          description: 'Test transaction 2',
          amount: 200,
          date: new Date(),
          type: TransactionTypeRole.WITHDRAWAL,
        },
      ];
      await service.createBatch(transactions);
      expect(amqpConnection.publish).toHaveBeenCalledTimes(transactions.length);
    });
  });

  describe('findAll', () => {
    it('should return all transactions for a user', async () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          userID: '1',
          description: 'First transaction',
          amount: 100,
          date: new Date(),
          type: TransactionTypeRole.WITHDRAWAL,
        },
        {
          id: 2,
          userID: '1',
          description: 'Second transaction',
          amount: 200,
          date: new Date(),
          type: TransactionTypeRole.WITHDRAWAL,
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(transactions);

      const result = await service.findAll('1');
      expect(result).toEqual(transactions);
      expect(repository.find).toHaveBeenCalledWith({
        where: { userID: '1' },
        order: { id: 'DESC' },
      });
    });
  });
});
