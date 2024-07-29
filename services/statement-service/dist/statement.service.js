"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const statement_entity_1 = require("./entity/statement.entity");
let StatementService = class StatementService {
    constructor(statementRepository) {
        this.statementRepository = statementRepository;
    }
    async create(createStatementDto) {
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
    async findAll(userID, fromDate, toDate) {
        const queryBuilder = this.statementRepository.createQueryBuilder('statement');
        queryBuilder.andWhere('statement.userID = :userID', { userID });
        if (fromDate) {
            queryBuilder.andWhere('statement.date >= :fromDate', { fromDate });
        }
        if (toDate) {
            queryBuilder.andWhere('statement.date <= :toDate', { toDate });
        }
        return queryBuilder.orderBy('statement.date', 'DESC').getMany();
    }
    async getBalance(userID) {
        const latestStatement = await this.statementRepository.findOne({
            where: { userID },
            order: { date: 'DESC' },
        });
        return latestStatement ? latestStatement.balance : 0;
    }
};
exports.StatementService = StatementService;
exports.StatementService = StatementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(statement_entity_1.Statement)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StatementService);
//# sourceMappingURL=statement.service.js.map