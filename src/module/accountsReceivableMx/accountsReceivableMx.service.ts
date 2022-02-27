import {Injectable} from "@nestjs/common";
import {AccountsReceivableMxEntity} from "./accountsReceivableMx.entity";
import {IAccountsReceivableMx} from "./accountsReceivableMx";
import {AccountsReceivableFindDto} from "./dto/accountsReceivableFind.dto";

@Injectable()
export class AccountsReceivableMxService {

    constructor(private readonly accountsReceivableMxEntity: AccountsReceivableMxEntity) {
    }

    public async findById(accountReceivableMxId: number) {
        return await this.accountsReceivableMxEntity.findById(accountReceivableMxId);
    }


    public async find(accountsReceivableFindDto: AccountsReceivableFindDto) {
        return await this.accountsReceivableMxEntity.find(accountsReceivableFindDto);
    }

    public async create(accountsReceivableMx: IAccountsReceivableMx) {
        return await this.accountsReceivableMxEntity.create(accountsReceivableMx);
    }

    public async deleteByCorrelation(correlationId: number, correlationType: number) {
        return await this.accountsReceivableMxEntity.delete_data(correlationId, correlationType);
    }
}