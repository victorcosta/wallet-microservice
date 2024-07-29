import { TransactionTypeRole } from '../entity/statement.entity';
export declare class CreateStatementDto {
    userID: string;
    description: string;
    amount: number;
    date: Date;
    type: TransactionTypeRole;
}
