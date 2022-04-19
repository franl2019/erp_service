import {Injectable} from "@nestjs/common";
import {AccountInComeSheetMxEntity} from "./accountInComeSheetMx.entity";
import {IAccountInComeSheetMx} from "./accountInComeSheetMx";

@Injectable()
export class AccountInComeSheetMxService {

    constructor(
        private readonly accountInComeSheetMxEntity: AccountInComeSheetMxEntity
    ) {
    }

    public async findById(accountInComeId: number) {
        return await this.accountInComeSheetMxEntity.findById(accountInComeId);
    }

    public async create(accountInComeSheetMxList: IAccountInComeSheetMx[]) {
        return await this.accountInComeSheetMxEntity.create(accountInComeSheetMxList);
    }

    public async deleteById(accountInComeAmountId: number) {
        return await this.accountInComeSheetMxEntity.deleteById(accountInComeAmountId);
    }
}