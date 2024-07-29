import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { StatementService } from './statement.service';
import { CreateStatementDto } from './dto/create-statement.dto';
import { Statement } from './entity/statement.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('statements')
@Controller('statements')
export class StatementController {
  constructor(private readonly statementService: StatementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new statement' })
  @ApiResponse({
    status: 201,
    description: 'The statement has been successfully created.',
    type: Statement,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateStatementDto })
  async create(
    @Body() createStatementDto: CreateStatementDto,
  ): Promise<Statement> {
    return this.statementService.create(createStatementDto);
  }

  @Get(':userID')
  @ApiOperation({ summary: 'Get all statements for a user' })
  @ApiResponse({
    status: 200,
    description: 'Return all statements for a user.',
    type: [Statement],
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiParam({ name: 'userID', required: true, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  async findAll(
    @Param('userID') userID: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<Statement[]> {
    console.log(
      'userID = ' + userID,
      'fromDate = ' + fromDate,
      'toDate = ' + toDate,
    );
    return this.statementService.findAll(userID, fromDate, toDate);
  }

  @Get('/balance/:userID')
  @ApiOperation({ summary: 'Get the balance' })
  @ApiResponse({
    status: 200,
    description: 'Return the balance for a user.',
    type: Number,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiParam({ name: 'userID', required: true, type: String })
  async getBalance(@Param('userID') userID: string): Promise<number> {
    return this.statementService.getBalance(userID);
  }
}
