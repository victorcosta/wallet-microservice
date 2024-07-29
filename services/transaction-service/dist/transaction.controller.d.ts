import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entity/transaction.entity';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    create(createTransactionDto: CreateTransactionDto): Promise<Transaction>;
    findAll(userID: string): Promise<Transaction[]>;
}
