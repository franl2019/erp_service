import {Injectable} from "@nestjs/common";
import {AccountInComeEntity} from "./accountInCome.entity";
import {AccountInComeFindDto} from "./dto/accountInComeFind.dto";
import {IAccountInCome} from "./accountInCome";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {AccountRecordService} from "../accountsRecord/accountRecord.service";
import {IAccountRecord} from "../accountsRecord/accountRecord";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable()
export class AccountInComeService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly accountInComeEntity: AccountInComeEntity,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly accountRecordService: AccountRecordService,
    ) {
    }

    public async find(accountInComeFindDto: AccountInComeFindDto) {
        return await this.accountInComeEntity.find(accountInComeFindDto);
    }

    public async findById(accountInComeId: number) {
        return await this.accountInComeEntity.findById(accountInComeId);
    }

    public async create(accountInCome: IAccountInCome) {
        return this.mysqldbAls.sqlTransaction(async () => {
            accountInCome.accountInComeCode = await this.autoCodeMxService.getAutoCode(19);
            return await this.accountInComeEntity.create(accountInCome);
        })
    }

    public async update(accountInCome: IAccountInCome) {
        await this.findById(accountInCome.accountInComeId);
        return await this.accountInComeEntity.update(accountInCome);
    }

    public async delete_data(accountInComeId: number, userName: string) {
        await this.findById(accountInComeId);
        return await this.accountInComeEntity.delete_data(accountInComeId, userName);
    }

    public async level1Review(accountInComeId: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const accountInCome = await this.findById(accountInComeId);
            await this.accountInComeEntity.level1Review(accountInComeId, userName);
            const accountRecord: IAccountRecord = {
                accountId: accountInCome.accountId,
                accountRecordId: 0,
                createdAt: new Date(),
                creater: userName,
                openQty: 0,
                creditQty: 0,
                debitQty: accountInCome.revenueAmt,
                balanceQty: 0,
                indate: accountInCome.indate,
                reMark: accountInCome.reMark,
                relatedNumber: accountInCome.paymentAccount,
                correlationId: accountInCome.accountInComeId,
                correlationType: 0
            }
            await this.accountRecordService.create(accountRecord);
            await this.accountRecordService.countAccountQty(accountRecord.accountId);
        })
    }

    public async unLevel1Review(accountInComeId: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const accountInCome = await this.findById(accountInComeId);
            await this.accountInComeEntity.unLevel1Review(accountInComeId);
            await this.accountRecordService.delete_data(accountInComeId, 0);
            await this.accountRecordService.countAccountQty(accountInCome.accountId);
        })
    }
}