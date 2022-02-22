import {AccountsReceivableEntity} from "./accountsReceivable.entity";
import {AccountsReceivableFindDto} from "./dto/accountsReceivableFind.dto";
import {IAccountsReceivable} from "./accountsReceivable";

export class AccountsReceivableService {

    constructor(private readonly accountsReceivableEntity: AccountsReceivableEntity) {
    }

    public async findById(accountsReceivableId: number) {
        return await this.accountsReceivableEntity.findById(accountsReceivableId);
    }

    public async find(findDto: AccountsReceivableFindDto) {
        return await this.accountsReceivableEntity.find(findDto);
    }

    public async create(accountsReceivable: IAccountsReceivable) {
        return await this.accountsReceivableEntity.create(accountsReceivable);
    }

    public async update(accountsReceivable: IAccountsReceivable) {
        return await this.accountsReceivableEntity.update(accountsReceivable);
    }

    public async delete_data(accountsReceivableId: number, userName: string) {
        return await this.accountsReceivableEntity.delete_data(accountsReceivableId, userName);
    }
}