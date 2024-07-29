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
exports.Statement = exports.TransactionTypeRole = void 0;
const typeorm_1 = require("typeorm");
var TransactionTypeRole;
(function (TransactionTypeRole) {
    TransactionTypeRole["ADDITION"] = "ADDITION";
    TransactionTypeRole["WITHDRAWAL"] = "WITHDRAWAL";
    TransactionTypeRole["PURCHASE"] = "PURCHASE";
    TransactionTypeRole["CANCELLATION"] = "CANCELLATION";
    TransactionTypeRole["REVERSAL"] = "REVERSAL";
})(TransactionTypeRole || (exports.TransactionTypeRole = TransactionTypeRole = {}));
let Statement = class Statement {
};
exports.Statement = Statement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Statement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Statement.prototype, "userID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Statement.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal'),
    __metadata("design:type", Number)
], Statement.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Statement.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TransactionTypeRole,
    }),
    __metadata("design:type", String)
], Statement.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal'),
    __metadata("design:type", Number)
], Statement.prototype, "balance", void 0);
exports.Statement = Statement = __decorate([
    (0, typeorm_1.Entity)()
], Statement);
//# sourceMappingURL=statement.entity.js.map