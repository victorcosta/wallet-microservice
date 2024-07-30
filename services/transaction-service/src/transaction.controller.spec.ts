import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entity/transaction.entity';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            createBatch: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createDto = new CreateTransactionDto();
      const transaction = new Transaction();

      jest.spyOn(service, 'create').mockResolvedValue(transaction);

      const result = await controller.create(createDto);
      expect(result).toEqual(transaction);
    });
  });

  describe('findAll', () => {
    it('should return all transactions for a user', async () => {
      const transactions: Transaction[] = [new Transaction()];
      jest.spyOn(service, 'findAll').mockResolvedValue(transactions);

      const result = await controller.findAll('1');
      expect(result).toEqual(transactions);
    });
  });

  describe('createBatch', () => {
    it('should handle batch creation', async () => {
      const createDtos: CreateTransactionDto[] = [new CreateTransactionDto()];
      jest.spyOn(service, 'createBatch').mockResolvedValue();

      await controller.createBatch(createDtos);
      expect(service.createBatch).toHaveBeenCalledWith(createDtos);
    });
  });
});
