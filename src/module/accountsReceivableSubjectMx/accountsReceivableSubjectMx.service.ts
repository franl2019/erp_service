import {Injectable} from "@nestjs/common";
import {AccountsReceivableSubjectMxEntity} from "./accountsReceivableSubjectMx.entity";
import {IAccountsReceivableSubjectMx} from "./accountsReceivableSubjectMx";

@Injectable()
export class AccountsReceivableSubjectMxService {

    constructor(private readonly accountsReceivableSubjectMxEntity: AccountsReceivableSubjectMxEntity) {
    }

    public async findById(accountsReceivableId: number) {
        return await this.accountsReceivableSubjectMxEntity.findById(accountsReceivableId);
    }

    public async create(accountsReceivableSubjectMx: IAccountsReceivableSubjectMx) {
        return await this.accountsReceivableSubjectMxEntity.create(accountsReceivableSubjectMx);
    }

    public async deleteById(accountsReceivableId: number) {
        return await this.accountsReceivableSubjectMxEntity.deleteById(accountsReceivableId);
    }

    public async deleteByCorrelation(correlationId:number,correlationType:number){
        return  await this.accountsReceivableSubjectMxEntity.deleteByCorrelation(correlationId, correlationType)
    }
}