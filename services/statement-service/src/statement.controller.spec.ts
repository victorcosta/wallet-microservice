import { Test, TestingModule } from '@nestjs/testing';
import { StatementController } from './statement.controller';
import { StatementService } from './statement.service';
import { CreateStatementDto } from './dto/create-statement.dto';
import { Statement, TransactionTypeRole } from './entity/statement.entity';

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
            create: jest.fn(),
            findAll: jest.fn(),
            getBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StatementController>(StatementController);
    service = module.get<StatementService>(StatementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new statement', async () => {
    const createStatementDto: CreateStatementDto = {
      userID: '1',
      description: 'Test',
      amount: 100,
      date: new Date(),
      type: TransactionTypeRole.ADDITION,
    };

    const result: Statement = {
      id: 1,
      ...createStatementDto,
      balance: 100,
    };

    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(createStatementDto)).toBe(result);
  });

  it('should get all statements for a user', async () => {
    const statements: Statement[] = [
      {
        id: 1,
        userID: '1',
        description: 'Test',
        amount: 100,
        date: new Date(),
        type: TransactionTypeRole.ADDITION,
        balance: 100,
      },
    ];

    jest.spyOn(service, 'findAll').mockResolvedValue(statements);

    expect(await controller.findAll('1')).toBe(statements);
  });

  it('should get the balance for a user', async () => {
    const balance = 100;

    jest.spyOn(service, 'getBalance').mockResolvedValue(balance);

    expect(await controller.getBalance('1')).toBe(balance);
  });
});
