import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statement } from './entity/statement.entity';
import { CreateStatementDto } from './dto/create-statement.dto';

@Injectable()
export class StatementService {
  constructor(
    @InjectRepository(Statement)
    private statementRepository: Repository<Statement>,
  ) {}

  private async saveStatement(
    createStatementDto: CreateStatementDto,
  ): Promise<Statement> {
    const { userID, description, amount, date, type } = createStatementDto;

    let balance = 0;

    const existingStatements = await this.statementRepository.findOne({
      where: { userID: userID },
      order: { id: 'DESC' },
    });

    balance = existingStatements
      ? Number(existingStatements.balance) + Number(amount)
      : amount;

    const newStatement = this.statementRepository.create({
      userID,
      description,
      amount,
      date,
      type,
      balance,
    });

    await this.statementRepository.save(newStatement);
    return newStatement;
  }

  async handleTransactionCreated(createStatementDto: CreateStatementDto) {
    // Lógica para lidar com a transação recebida via RabbitMQ
    this.saveStatement(createStatementDto);
  }

  async create(createStatementDto: CreateStatementDto): Promise<Statement> {
    const newStatement = await this.saveStatement(createStatementDto);
    return newStatement;
  }

  async findAll(
    userID: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<Statement[]> {
    const queryBuilder =
      this.statementRepository.createQueryBuilder('statement');

    queryBuilder.andWhere('statement.userID = :userID', { userID });

    if (fromDate) {
      queryBuilder.andWhere('statement.date >= :fromDate', { fromDate });
    }
    if (toDate) {
      queryBuilder.andWhere('statement.date <= :toDate', { toDate });
    }

    return queryBuilder.orderBy('statement.id', 'DESC').getMany();
  }

  async getBalance(userID: string): Promise<number> {
    const latestStatement = await this.statementRepository.findOne({
      where: { userID },
      order: { id: 'DESC' },
    });
    return latestStatement ? latestStatement.balance : 0;
  }
}
