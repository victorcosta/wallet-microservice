import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionService {
    private transactionRepository;
    constructor(transactionRepository: Repository<Transaction>);
    create(createTransactionDto: CreateTransactionDto): Promise<Transaction>;
    findAll(userID: string): Promise<Transaction[]>;
    private updateStatementService;
}
