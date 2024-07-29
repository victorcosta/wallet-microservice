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

  async create(createStatementDto: CreateStatementDto): Promise<Statement> {
    const lastStatement = await this.statementRepository.findOne({
      where: { userID: createStatementDto.userID },
      order: { date: 'DESC' },
    });
    const balance = lastStatement
      ? lastStatement.balance + createStatementDto.amount
      : createStatementDto.amount;
    const newStatement = this.statementRepository.create({
      ...createStatementDto,
      balance,
    });
    await this.statementRepository.save(newStatement);
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

    return queryBuilder.orderBy('statement.date', 'DESC').getMany();
  }

  async getBalance(userID: string): Promise<number> {
    const latestStatement = await this.statementRepository.findOne({
      where: { userID },
      order: { date: 'DESC' },
    });
    return latestStatement ? latestStatement.balance : 0;
  }
}
