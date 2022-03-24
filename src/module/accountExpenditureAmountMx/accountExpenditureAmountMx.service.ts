import {Injectable} from "@nestjs/common";
import {AccountExpenditureAmountMxEntity} from "./accountExpenditureAmountMx.entity";
import {IAccountExpenditureAmountMx} from "./accountExpenditureAmountMx";

@Injectable()
export class AccountExpenditureAmountMxService {

    constructor(
        private readonly accountExpenditureAmountMxEntity: AccountExpenditureAmountMxEntity,
    ) {
    }

    public async findById(accountExpenditureId: number) {
        return await this.accountExpenditureAmountMxEntity.findById(accountExpenditureId);
    }

    public async create(accountExpenditureAmountMxList: IAccountExpenditureAmountMx[]) {
        return await this.accountExpenditureAmountMxEntity.create(accountExpenditureAmountMxList)
    }

    public async deleteById(accountExpenditureId: number) {
        return await this.accountExpenditureAmountMxEntity.deleteById(accountExpenditureId);
    }
}