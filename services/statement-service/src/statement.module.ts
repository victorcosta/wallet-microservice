import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatementService } from './statement.service';
import { StatementController } from './statement.controller';
import { Statement } from './entity/statement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Statement])],
  providers: [StatementService],
  controllers: [StatementController],
})
export class StatementModule {}
