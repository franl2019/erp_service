import {AccountsPayableEntity} from "./accountsPayable.entity";
import {AccountsPayableFindDto} from "./dto/accountsPayableFind.dto";
import {IAccountsPayable} from "./accountsPayable";

export class AccountsPayableService {

    constructor(private readonly accountsPayableEntity: AccountsPayableEntity) {
    }

    public async findById(accountsPayableId: number) {
        return await this.accountsPayableEntity.findById(accountsPayableId);
    }

    public async find(findDto: AccountsPayableFindDto) {
        return await this.accountsPayableEntity.find(findDto);
    }

    public async create(accountsPayable: IAccountsPayable) {
        return await this.accountsPayableEntity.create(accountsPayable);
    }

    public async update(accountsPayable: IAccountsPayable) {
        return await this.accountsPayableEntity.update(accountsPayable);
    }

    public async delete_data(accountsPayableId: number, userName: string) {
        return await this.accountsPayableEntity.delete_data(accountsPayableId, userName);
    }
}