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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStatementDto = void 0;
const class_validator_1 = require("class-validator");
const statement_entity_1 = require("../entity/statement.entity");
const swagger_1 = require("@nestjs/swagger");
class CreateStatementDto {
}
exports.CreateStatementDto = CreateStatementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID', example: '1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStatementDto.prototype, "userID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the statement', example: 'Test' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStatementDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Amount of the statement', example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateStatementDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of the statement', example: '2023-01-01' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateStatementDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of the statement',
        example: statement_entity_1.TransactionTypeRole.ADDITION,
        enum: statement_entity_1.TransactionTypeRole,
    }),
    (0, class_validator_1.IsEnum)(statement_entity_1.TransactionTypeRole),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStatementDto.prototype, "type", void 0);
//# sourceMappingURL=create-statement.dto.js.map