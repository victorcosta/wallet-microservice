import { StatementService } from './statement.service';
import { CreateStatementDto } from './dto/create-statement.dto';
import { Statement } from './entity/statement.entity';
export declare class StatementController {
    private readonly statementService;
    constructor(statementService: StatementService);
    create(createStatementDto: CreateStatementDto): Promise<Statement>;
    findAll(userID: string, fromDate?: string, toDate?: string): Promise<Statement[]>;
    getBalance(userID: string): Promise<number>;
}
