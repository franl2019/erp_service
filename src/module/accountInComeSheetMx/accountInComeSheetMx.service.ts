import {Injectable} from "@nestjs/common";
import {AccountInComeSheetMxEntity} from "./accountInComeSheetMx.entity";
import {IAccountInComeSheetMx} from "./accountInComeSheetMx";

@Injectable()
export class AccountInComeSheetMxService {

    constructor(
        private readonly accountInComeSheetMxEntity: AccountInComeSheetMxEntity
    ) {
    }

    public async find(accountInComeAmountId: number) {
        return await this.accountInComeSheetMxEntity.find(accountInComeAmountId);
    }

    public async findById(accountInComeSheetMxId: number) {
        return await this.accountInComeSheetMxEntity.findById(accountInComeSheetMxId);
    }

    public async create(accountInComeSheetMx: IAccountInComeSheetMx) {
        return await this.accountInComeSheetMxEntity.create(accountInComeSheetMx);
    }

    public async deleteById(accountInComeAmountId: number) {
        return await this.accountInComeSheetMxEntity.deleteById(accountInComeAmountId);
    }
}