import { Test, TestingModule } from '@nestjs/testing';
import { StatementController } from '../statement.controller';
import { StatementService } from '../statement.service';
import { Statement } from '../entity/statement.entity';
import { TransactionTypeRole } from '../entity/statement.entity';
import { CreateStatementDto } from '../dto/create-statement.dto';

describe('StatementController', () => {
  let controller: StatementController;
  let service: StatementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatementController],
      providers: [
        {
          provide: StatementService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            getBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StatementController>(StatementController);
    service = module.get<StatementService>(StatementService);
  });

  it('should create a new statement', async () => {
    const createDto: CreateStatementDto = {
      userID: '1',
      description: 'New Deposit',
      amount: 150,
      date: new Date('2024-01-03T00:00:00.000Z'),
      type: TransactionTypeRole.ADDITION,
    };
    const expectedStatement: Statement = {
      ...createDto,
      id: 3,
      balance: 250,
    };

    jest.spyOn(service, 'create').mockResolvedValue(expectedStatement);

    const result = await controller.create(createDto);
    expect(result).toEqual(expectedStatement);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  it('should return all statements for a user', async () => {
    const statements: Statement[] = [
      {
        id: 1,
        userID: '1',
        description: 'Test transaction',
        amount: 100,
        date: new Date('2024-01-01T00:00:00.000Z'),
        type: TransactionTypeRole.ADDITION,
        balance: 100,
      },
      {
        id: 2,
        userID: '1',
        description: 'Another test transaction',
        amount: 200,
        date: new Date('2024-01-02T00:00:00.000Z'),
        type: TransactionTypeRole.WITHDRAWAL,
        balance: 300,
      },
    ];

    jest.spyOn(service, 'findAll').mockResolvedValue(statements);

    const result = await controller.findAll('1', '2024-01-01', '2024-01-02');
    expect(result).toEqual(statements);
    expect(service.findAll).toHaveBeenCalledWith(
      '1',
      '2024-01-01',
      '2024-01-02',
    );
  });

  it('should return the balance for a user', async () => {
    const userID = '1';
    const balance = 500;

    jest.spyOn(service, 'getBalance').mockResolvedValue(balance);

    const result = await controller.getBalance(userID);
    expect(result).toBe(balance);
    expect(service.getBalance).toHaveBeenCalledWith(userID);
  });
});
