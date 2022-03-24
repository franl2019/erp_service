import {Injectable} from "@nestjs/common";
import {AccountsPayableSubjectMxEntity} from "./accountsPayableSubjectMx.entity";
import {IAccountsPayableSubjectMx} from "./accountsPayableSubjectMx";

@Injectable()
export class AccountsPayableSubjectMxService {

    constructor(
        private readonly accountsPayableSubjectMxEntity: AccountsPayableSubjectMxEntity
    ) {
    }

    public async findById(accountsPayableId: number) {
        return await this.accountsPayableSubjectMxEntity.find(accountsPayableId);
    }

    public async create(accountsPayableSubjectMx: IAccountsPayableSubjectMx) {
        return await this.accountsPayableSubjectMxEntity.create(accountsPayableSubjectMx);
    }

    public async deleteById(accountsPayableId: number) {
        return await this.accountsPayableSubjectMxEntity.deleteById(accountsPayableId);
    }

    public async deleteByCorrelation(correlationId: number, correlationType: number) {
        return await this.accountsPayableSubjectMxEntity.deleteByCorrelation(correlationId, correlationType);
    }
}