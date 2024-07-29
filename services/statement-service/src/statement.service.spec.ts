import { Test, TestingModule } from '@nestjs/testing';
import { StatementService } from './statement.service';
import { Statement } from './entity/statement.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatementDto } from './dto/create-statement.dto';
import { TransactionTypeRole } from './entity/statement.entity';

describe('StatementService', () => {
  let service: StatementService;
  let repository: Repository<Statement>;

  const statementRepositoryMock = {
    create: jest.fn().mockImplementation((dto) => ({
      ...dto,
      id: 1,
      balance: 100,
    })),
    save: jest.fn().mockResolvedValue((dto) => ({
      id: 1,
      ...dto,
      balance: 100,
    })),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatementService,
        {
          provide: getRepositoryToken(Statement),
          useValue: statementRepositoryMock,
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

  it('should create a new statement', async () => {
    const createStatementDto: CreateStatementDto = {
      userID: '1',
      description: 'Test',
      amount: 100,
      date: new Date(),
      type: TransactionTypeRole.ADDITION,
    };

    // Configure mock to findOne Method
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

    // Configure mock to save Method
    jest.spyOn(repository, 'save').mockResolvedValueOnce({
      ...createStatementDto,
      id: 1,
      balance: 100,
    } as Statement);

    const result = await service.create(createStatementDto);

    expect(result).toEqual({
      id: 1,
      ...createStatementDto,
      balance: 100,
    });
  });
});
