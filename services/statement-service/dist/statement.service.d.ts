import { Repository } from 'typeorm';
import { Statement } from './entity/statement.entity';
import { CreateStatementDto } from './dto/create-statement.dto';
export declare class StatementService {
    private statementRepository;
    constructor(statementRepository: Repository<Statement>);
    create(createStatementDto: CreateStatementDto): Promise<Statement>;
    findAll(userID: string, fromDate?: string, toDate?: string): Promise<Statement[]>;
    getBalance(userID: string): Promise<number>;
}
