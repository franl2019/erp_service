import {Injectable} from "@nestjs/common";
import {AccountExpenditureSheetMxEntity} from "./accountExpenditureSheetMx.entity";
import {IAccountExpenditureSheetMx} from "./accountExpenditureSheetMx";

@Injectable()
export class AccountExpenditureSheetMxService {

    constructor(
        private readonly accountExpenditureSheetMxEntity: AccountExpenditureSheetMxEntity
    ) {
    }

    public async findById(accountExpenditureId: number) {
        return await this.accountExpenditureSheetMxEntity.findById(accountExpenditureId);
    }

    public async create(accountExpenditureSheetMxList: IAccountExpenditureSheetMx[]) {
        return await this.accountExpenditureSheetMxEntity.create(accountExpenditureSheetMxList);
    }

    public async deleteById(accountExpenditureId: number) {
        return await this.accountExpenditureSheetMxEntity.deleteById(accountExpenditureId)
    }
}