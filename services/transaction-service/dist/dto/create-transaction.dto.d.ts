import { TransactionTypeRole } from '../entity/transaction.entity';
export declare class CreateTransactionDto {
    userID: string;
    description: string;
    amount: number;
    date: Date;
    type: TransactionTypeRole;
}
