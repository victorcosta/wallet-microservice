import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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
    const whereConditions: any = { userID };

    if (fromDate && toDate) {
      // Se ambas as datas estão presentes, use Between
      whereConditions.date = Between(fromDate, toDate);
    } else if (fromDate) {
      // Se somente fromDate é fornecido, calcule toDate como 30 dias para frente
      const toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + 30);
      whereConditions.date = Between(fromDate, toDate.toISOString());
    } else if (toDate) {
      // Se somente toDate é fornecido, calcule fromDate como 30 dias para trás
      const fromDate = new Date(toDate);
      fromDate.setDate(fromDate.getDate() - 30);
      whereConditions.date = Between(fromDate.toISOString(), toDate);
    }

    return this.statementRepository.find({
      where: whereConditions,
      order: {
        id: 'DESC',
      },
    });
  }

  async getBalance(userID: string): Promise<number> {
    const latestStatement = await this.statementRepository.findOne({
      where: { userID },
      order: { id: 'DESC' },
    });
    return latestStatement ? latestStatement.balance : 0;
  }
}
