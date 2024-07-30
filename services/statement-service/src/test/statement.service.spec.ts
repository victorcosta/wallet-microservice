import { Test, TestingModule } from '@nestjs/testing';
import { StatementService } from '../statement.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Statement, TransactionTypeRole } from '../entity/statement.entity';
import { CreateStatementDto } from '../dto/create-statement.dto';

describe('StatementService', () => {
  let service: StatementService;
  let repository: Repository<Statement>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatementService,
        {
          provide: getRepositoryToken(Statement),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockImplementation((dto) => ({
              ...dto,
              id: 1,
              balance: 100,
            })),
            save: jest
              .fn()
              .mockImplementation((statement) => Promise.resolve(statement)),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StatementService>(StatementService);
    repository = module.get<Repository<Statement>>(
      getRepositoryToken(Statement),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateStatementDto = {
      userID: '1',
      description: 'Deposit',
      amount: 100,
      date: new Date(),
      type: TransactionTypeRole.ADDITION,
    };

    it('should successfully create a new statement', async () => {
      const result = await service.create(createDto);
      expect(result).toEqual({
        ...createDto,
        id: 1,
        balance: 100,
      });
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should handle existing statement and update balance', async () => {
      const existingStatement: Statement = {
        id: 1,
        userID: '1',
        description: 'Deposit initial',
        amount: 50,
        date: new Date(),
        type: TransactionTypeRole.ADDITION,
        balance: 50,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(existingStatement);

      jest
        .spyOn(repository, 'save')
        .mockImplementation(async (statement: Statement) => {
          return {
            ...statement,
            balance: existingStatement.balance + createDto.amount,
          };
        });

      const createDto: CreateStatementDto = {
        userID: '1',
        description: 'Deposit',
        amount: 100,
        date: new Date(),
        type: TransactionTypeRole.ADDITION,
      };

      const result = await service.create(createDto);
      expect(result.balance).toBe(100);
    });

    it('should throw an error if save fails', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Failed to save'));

      await expect(service.create(createDto)).rejects.toThrow('Failed to save');
    });
  });

  describe('findAll', () => {
    it('should handle date range search correctly', async () => {
      const statements: Statement[] = [
        {
          id: 1,
          userID: '1',
          description: 'Transaction 1',
          amount: 100,
          date: new Date('2022-01-15'),
          type: TransactionTypeRole.ADDITION,
          balance: 200,
        },
        {
          id: 2,
          userID: '1',
          description: 'Transaction 2',
          amount: 200,
          date: new Date('2022-01-20'),
          type: TransactionTypeRole.WITHDRAW,
          balance: 0,
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(statements);

      const fromDate = new Date('2022-01-01').toISOString();
      const toDate = new Date('2022-01-31').toISOString();
      const result = await service.findAll('1', fromDate, toDate);

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          userID: '1',
          date: Between(fromDate, toDate),
        },
        order: {
          id: 'DESC',
        },
      });
      expect(result).toEqual(statements);
    });

    it('should handle only fromDate provided', async () => {
      const toDate = new Date('2022-01-01');
      toDate.setDate(toDate.getDate() + 30);

      jest.spyOn(repository, 'find').mockImplementation((options) => {
        expect(options.where).toMatchObject({
          date: Between(
            new Date('2022-01-01').toISOString(),
            toDate.toISOString(),
          ),
        });
        return Promise.resolve([]);
      });

      await service.findAll('1', new Date('2022-01-01').toISOString());
    });

    it('should handle only toDate provided', async () => {
      const toDate = new Date();
      const fromDate = new Date(toDate);
      fromDate.setDate(fromDate.getDate() - 30);

      jest.spyOn(repository, 'find').mockImplementation((options) => {
        expect(options.where).toMatchObject({
          date: Between(fromDate.toISOString(), toDate.toISOString()),
        });
        return Promise.resolve([]); // Assumindo que não há declarações para simplificar
      });

      await service.findAll('1', undefined, toDate.toISOString());
    });
  });

  describe('getBalance', () => {
    it('should return the current balance', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({
        id: 1,
        userID: '1',
        description: 'Transaction',
        amount: 100,
        date: new Date(),
        type: TransactionTypeRole.ADDITION,
        balance: 100,
      });

      const balance = await service.getBalance('1');
      expect(balance).toBe(100);
    });

    it('should return 0 if no statements found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const balance = await service.getBalance('1');
      expect(balance).toBe(0);
    });
  });
});
