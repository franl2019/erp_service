import {Injectable} from "@nestjs/common";
import {AccountRecordEntity} from "./accountRecord.entity";
import {IAccountRecordFindDto} from "./dto/accountRecordFind.dto";
import {IAccountRecord} from "./accountRecord";
import {CashBankDepositJournalDto} from "./dto/cashBankDepositJournal.dto";
import {CodeType} from "../autoCode/codeType";
import {IAccountInCome} from "../accountInCome/accountInCome";
import {IAccountInComeAmountMx} from "../accountInComeAmountMx/accountInComeAmountMx";

@Injectable()
export class AccountRecordService {

    constructor(
        private readonly accountRecordEntity: AccountRecordEntity
    ) {
    }

    public async findById(accountRecordId: number) {
        return await this.accountRecordEntity.findById(accountRecordId);
    }

    public async find(findDto: IAccountRecordFindDto) {
        return await this.accountRecordEntity.find(findDto);
    }

    public async create(accountRecord: IAccountRecord) {
        return await this.accountRecordEntity.create(accountRecord);
    }

    //销售收入
    public async salesRevenue(accountInCome: IAccountInCome, accountInComeAmountMx: IAccountInComeAmountMx) {
        //增加出纳收款

    }

    public async countAccountQty(accountId: number) {
        return await this.accountRecordEntity.countAccountQty(accountId);
    }

    public async cashBankDepositJournal(cashBankDepositJournalDto: CashBankDepositJournalDto) {
        return await this.accountRecordEntity.cashBankDepositJournal(cashBankDepositJournalDto);
    }

    public async delete_data(correlationId: number, type: CodeType.accountInCome | CodeType.FK) {
        return await this.accountRecordEntity.delete_data(correlationId, type);
    }
}