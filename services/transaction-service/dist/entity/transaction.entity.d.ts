export declare enum TransactionTypeRole {
    ADDITION = "ADDITION",
    WITHDRAWAL = "WITHDRAWAL",
    PURCHASE = "PURCHASE",
    CANCELLATION = "CANCELLATION",
    REVERSAL = "REVERSAL"
}
export declare class Transaction {
    id: number;
    userID: string;
    description: string;
    amount: number;
    date: Date;
    type: TransactionTypeRole;
}
