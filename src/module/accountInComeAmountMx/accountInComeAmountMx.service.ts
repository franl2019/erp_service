import {Injectable} from "@nestjs/common";
import {AccountInComeAmountMxEntity} from "./accountInComeAmountMx.entity";
import {IAccountInComeAmountMx} from "./accountInComeAmountMx";

@Injectable()
export class AccountInComeAmountMxService {

    constructor(
        private readonly accountInComeAmountMxEntity: AccountInComeAmountMxEntity
    ) {
    }

    public async findById(accountInComeId: number) {
        return await this.accountInComeAmountMxEntity.findById(accountInComeId);
    }

    public async create(accountInComeAmountMxList: IAccountInComeAmountMx[]) {
        return await this.accountInComeAmountMxEntity.create(accountInComeAmountMxList);
    }

    public async deleteById(accountInComeId: number) {
        return await this.accountInComeAmountMxEntity.deleteById(accountInComeId);
    }
}