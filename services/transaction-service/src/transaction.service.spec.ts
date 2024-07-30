import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction, TransactionTypeRole } from './entity/transaction.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
        {
          provide: 'STATEMENT_SERVICE',
          useValue: { emit: jest.fn(() => of(true)) },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    client = module.get<ClientProxy>('STATEMENT_SERVICE');
  });

  it('should create a transaction and emit an event', async () => {
    const createTransactionDto: CreateTransactionDto = {
      userID: '1',
      description: 'Test transaction',
      amount: 100,
      date: new Date(),
      type: TransactionTypeRole.ADDITION,
    };

    const savedTransaction = { ...createTransactionDto, id: 1 } as Transaction;

    jest.spyOn(repository, 'save').mockResolvedValue(savedTransaction);
    jest.spyOn(client, 'emit').mockImplementation(() => of(true).toPromise());

    const result = await service.create(createTransactionDto);

    expect(result).toEqual(savedTransaction);
    expect(client.emit).toHaveBeenCalledWith(
      'transaction_created',
      savedTransaction,
    );
  });
});
function of(arg0: boolean) {
  throw new Error('Function not implemented.');
}
