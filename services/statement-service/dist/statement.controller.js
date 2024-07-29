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
exports.StatementController = void 0;
const common_1 = require("@nestjs/common");
const statement_service_1 = require("./statement.service");
const create_statement_dto_1 = require("./dto/create-statement.dto");
const statement_entity_1 = require("./entity/statement.entity");
const swagger_1 = require("@nestjs/swagger");
let StatementController = class StatementController {
    constructor(statementService) {
        this.statementService = statementService;
    }
    async create(createStatementDto) {
        return this.statementService.create(createStatementDto);
    }
    async findAll(userID, fromDate, toDate) {
        console.log('userID = ' + userID, 'fromDate = ' + fromDate, 'toDate = ' + toDate);
        return this.statementService.findAll(userID, fromDate, toDate);
    }
    async getBalance(userID) {
        return this.statementService.getBalance(userID);
    }
};
exports.StatementController = StatementController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new statement' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The statement has been successfully created.',
        type: statement_entity_1.Statement,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request.' }),
    (0, swagger_1.ApiBody)({ type: create_statement_dto_1.CreateStatementDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_statement_dto_1.CreateStatementDto]),
    __metadata("design:returntype", Promise)
], StatementController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':userID'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all statements for a user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return all statements for a user.',
        type: [statement_entity_1.Statement],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request.' }),
    (0, swagger_1.ApiParam)({ name: 'userID', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'fromDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'toDate', required: false, type: String }),
    __param(0, (0, common_1.Param)('userID')),
    __param(1, (0, common_1.Query)('fromDate')),
    __param(2, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StatementController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/balance/:userID'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the balance' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return the balance for a user.',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request.' }),
    (0, swagger_1.ApiParam)({ name: 'userID', required: true, type: String }),
    __param(0, (0, common_1.Param)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatementController.prototype, "getBalance", null);
exports.StatementController = StatementController = __decorate([
    (0, swagger_1.ApiTags)('statements'),
    (0, common_1.Controller)('statements'),
    __metadata("design:paramtypes", [statement_service_1.StatementService])
], StatementController);
//# sourceMappingURL=statement.controller.js.map