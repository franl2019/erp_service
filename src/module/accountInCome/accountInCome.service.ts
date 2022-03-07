import {Injectable} from "@nestjs/common";
import {AccountInComeEntity} from "./accountInCome.entity";
import {AccountInComeFindDto} from "./dto/accountInComeFind.dto";
import {IAccountInCome} from "./accountInCome";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {AccountInComeAmountMxService} from "../accountInComeAmountMx/accountInComeAmountMx.service";
import {AccountRecordService} from "../accountsRecord/accountRecord.service";
import {CodeType} from "../autoCode/codeType";
import {AccountsReceivableService} from "../accountsReceivable/accountsReceivable.service";
import {AccountCategory} from "../accountsVerifySheetMx/accountCategory";
import {AccountsReceivableMxService} from "../accountsReceivableMx/accountsReceivableMx.service";

@Injectable()
export class AccountInComeService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly accountInComeEntity: AccountInComeEntity,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly accountInComeAmountMxService: AccountInComeAmountMxService,
        private readonly accountRecordService: AccountRecordService,
        private readonly accountsReceivableService: AccountsReceivableService,
        private readonly accountsReceivableMxService: AccountsReceivableMxService,
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

            //验证单头状态是否可以出纳审核
            if (accountInCome.level1Review !== 0 && accountInCome.level2Review !== 0 && accountInCome.del_uuid !== 0) {
                return Promise.reject(new Error('审核失败,收款单状态不正确'));
            }

            //获取收款单收款明细
            const accountInComeAmountMxList = await this.accountInComeAmountMxService.find(accountInCome.accountInComeId);

            for (let i = 0; i < accountInComeAmountMxList.length; i++) {
                const accountInComeAmountMx = accountInComeAmountMxList[i];

                //增加出纳收款
                await this.accountRecordService.create({
                    accountId: accountInComeAmountMx.accountId,
                    accountRecordId: 0,
                    correlationId: accountInCome.accountInComeId,
                    correlationType: CodeType.SR,
                    creater: userName,
                    createdAt: new Date(),
                    creditQty: 0,
                    balanceQty: 0,
                    debitQty: accountInComeAmountMx.amount,
                    indate: accountInCome.indate,
                    openQty: 0,
                    reMark: "",
                    relatedNumber: ""
                });

                //增加应收收款
                const createAccountsReceivableResult = await this.accountsReceivableService.create({
                    accountsReceivableId: 0,
                    accountsReceivableType: AccountCategory.accountsReceivable,
                    amounts: accountInComeAmountMx.accountsReceivable,
                    checkedAmounts: 0,
                    notCheckAmounts: accountInComeAmountMx.accountsReceivable,
                    clientid: accountInCome.clientid,
                    correlationId: accountInCome.accountInComeId,
                    correlationType: CodeType.SR,
                    createdAt: new Date(),
                    creater: userName,
                    del_uuid: 0,
                    deletedAt: null,
                    deleter: "",
                    inDate: accountInCome.indate,
                    updatedAt: null,
                    updater: ""
                })

                await this.accountsReceivableMxService.create({
                    accountReceivableMxId: 0,
                    accountsReceivableId: createAccountsReceivableResult.insertId,
                    actuallyReceived: 0,
                    advancesReceived: accountInComeAmountMx.accountsReceivable,
                    correlationId: accountInCome.accountInComeId,
                    correlationType: CodeType.SR,
                    createdAt: new Date(),
                    creater: userName,
                    inDate: accountInCome.indate,
                    abstract: "",
                    reMark: "",
                    receivables: 0,
                    updatedAt: null,
                    updater: ""
                })
            }

            // await this.accountRecordService.create(accountRecord);
            // await this.accountRecordService.countAccountQty(accountRecord.accountId);
        })
    }

    public async unLevel1Review(accountInComeId: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const accountInCome = await this.findById(accountInComeId);
            await this.accountInComeEntity.unLevel1Review(accountInComeId);
            // await this.accountRecordService.delete_data(accountInComeId, 0);
            // await this.accountRecordService.countAccountQty(accountInCome.accountId);
        })
    }
}