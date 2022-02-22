import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {AccountExpenditureEntity} from "./accountExpenditure.entity";
import {IAccountExpenditure} from "./accountExpenditure";
import {AccountExpenditureFindDto} from "./dto/accountExpenditureFind.dto";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {AccountRecordService} from "../accountsRecord/accountRecord.service";
import {IAccountRecord} from "../accountsRecord/accountRecord";

@Injectable()
export class AccountExpenditureService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly accountRecordService: AccountRecordService,
        private readonly accountExpenditureEntity: AccountExpenditureEntity
    ) {
    }

    public async findById(accountExpenditureId: number) {
        return await this.accountExpenditureEntity.findById(accountExpenditureId);
    }

    public async find(accountExpenditureFindDto: AccountExpenditureFindDto) {
        return await this.accountExpenditureEntity.find(accountExpenditureFindDto);
    }

    public async create(accountExpenditure: IAccountExpenditure) {
        accountExpenditure.accountExpenditureCode = await this.autoCodeMxService.getAutoCode(18);
        return await this.accountExpenditureEntity.create(accountExpenditure);
    }

    public async update(accountExpenditure: IAccountExpenditure) {
        const accountExpenditure_db = await this.findById(accountExpenditure.accountExpenditureId);
        if (accountExpenditure_db.level1Review !== 0 && accountExpenditure_db.level2Review !== 0) {
            return Promise.reject(new Error("更新失败，请先撤审此单据"));
        }
        return await this.accountExpenditureEntity.update(accountExpenditure);
    }

    public async level1Review(accountExpenditureId: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const accountExpenditure_db = await this.findById(accountExpenditureId);
            if (accountExpenditure_db.level1Review !== 0 && accountExpenditure_db.level2Review !== 0) {
                return Promise.reject(new Error("审核失败"));
            }

            const accountRecord: IAccountRecord = {
                accountId: accountExpenditure_db.accountId,
                accountRecordId: 0,
                createdAt: new Date(),
                creater: userName,
                openQty: 0,
                creditQty: accountExpenditure_db.expenditureAmt,
                debitQty: 0,
                balanceQty: 0,
                indate: accountExpenditure_db.indate,
                reMark: accountExpenditure_db.reMark,
                relatedNumber: accountExpenditure_db.collectionAccount,
                correlationId: accountExpenditure_db.accountExpenditureId,
                correlationType: 1
            };
            await this.accountRecordService.create(accountRecord);
            await this.accountRecordService.countAccountQty(accountRecord.accountId);
            return await this.accountExpenditureEntity.level1Review(accountExpenditureId, userName);
        });
    }

    public async unLevel1Review(accountExpenditureId: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const accountExpenditure_db = await this.findById(accountExpenditureId);
            if (accountExpenditure_db.level1Review !== 1 && accountExpenditure_db.level2Review !== 0) {
                return Promise.reject(new Error("撤审失败"));
            }

            await this.accountRecordService.delete_data(0, 1);
            await this.accountRecordService.countAccountQty(accountExpenditure_db.accountId);
            return await this.accountExpenditureEntity.unLevel1Review(accountExpenditureId);
        });
    }

    public async delete_data(accountExpenditureId: number, userName: string) {
        const accountExpenditure_db = await this.findById(accountExpenditureId);
        if (accountExpenditure_db.level1Review !== 0 && accountExpenditure_db.level2Review !== 0) {
            return Promise.reject(new Error("更新失败，请先撤审此单据"));
        }
        return await this.accountExpenditureEntity.delete_data(accountExpenditureId, userName);
    }
}