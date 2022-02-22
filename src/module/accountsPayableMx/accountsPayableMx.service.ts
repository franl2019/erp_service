import {Injectable} from "@nestjs/common";
import {AccountsPayableMxEntity} from "./accountsPayableMx.entity";
import {IAccountsPayableMx} from "./accountsPayableMx";
import {AccountsPayableFindDto} from "./dto/accountsPayableFind.dto";

@Injectable()
export class AccountsPayableMxService {

    constructor(private readonly accountsPayableMxEntity: AccountsPayableMxEntity) {
    }

    public async findById(accountsPayableMxId: number) {
        return await this.accountsPayableMxEntity.findById(accountsPayableMxId);
    }


    public async find(accountsPayableFindDto: AccountsPayableFindDto) {
        return await this.accountsPayableMxEntity.find(accountsPayableFindDto);
    }

    public async create(accountsPayableMx: IAccountsPayableMx) {
        return await this.accountsPayableMxEntity.create(accountsPayableMx);
    }

    public async delete_data(correlationId: number, correlationType: number) {
        return await this.accountsPayableMxEntity.delete_data(correlationId, correlationType);
    }
}