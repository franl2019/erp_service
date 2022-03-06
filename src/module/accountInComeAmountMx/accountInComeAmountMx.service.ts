import {Injectable} from "@nestjs/common";
import {AccountInComeAmountMxEntity} from "./accountInComeAmountMx.entity";
import {IAccountInComeAmountMx} from "./accountInComeAmountMx";

@Injectable()
export class AccountInComeAmountMxService {

    constructor(
        private readonly accountInComeAmountMxEntity: AccountInComeAmountMxEntity
    ) {
    }

    public async findById(accountInComeAmountMxId: number) {
        return await this.accountInComeAmountMxEntity.findById(accountInComeAmountMxId);
    }

    public async find(accountInComeAmountId: number) {
        return await this.accountInComeAmountMxEntity.find(accountInComeAmountId);
    }

    public async create(account_income_amount_mx: IAccountInComeAmountMx) {
        return await this.accountInComeAmountMxEntity.create(account_income_amount_mx);
    }

    public async deleteById(accountInComeAmountId: number) {
        return await this.accountInComeAmountMxEntity.deleteById(accountInComeAmountId);
    }
}