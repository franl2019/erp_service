import {AccountsReceivableEntity} from "./accountsReceivable.entity";
import {AccountsReceivableFindDto} from "./dto/accountsReceivableFind.dto";
import {IAccountsReceivable} from "./accountsReceivable";
import {bignumber, chain, round} from "mathjs";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {AccountsReceivableMxService} from "../accountsReceivableMx/accountsReceivableMx.service";
import {AccountCategoryType} from "../accountsVerifySheetMx/accountCategoryType";
import {IAccountsReceivableMx} from "../accountsReceivableMx/accountsReceivableMx";
import {IAccountsReceivableSubjectMx} from "../accountsReceivableSubjectMx/accountsReceivableSubjectMx";
import {AccountsReceivableSubjectMxService} from "../accountsReceivableSubjectMx/accountsReceivableSubjectMx.service";
import {Injectable} from "@nestjs/common";

@Injectable()
export class AccountsReceivableService {

    constructor(
        private readonly accountsReceivableEntity: AccountsReceivableEntity,
        private readonly accountsReceivableMxService: AccountsReceivableMxService,
        private readonly accountsReceivableSubjectMxService: AccountsReceivableSubjectMxService,
        private readonly mysqldbAls: MysqldbAls,
    ) {
    }

    public async findById(accountsReceivableId: number) {
        return await this.accountsReceivableEntity.findById(accountsReceivableId);
    }

    public async find(findDto: AccountsReceivableFindDto) {
        return await this.accountsReceivableEntity.find(findDto);
    }

    //创建应收账款
    public async createAccountsReceivable(accountsReceivable: IAccountsReceivable) {
        return this.mysqldbAls.sqlTransaction(async () => {
            //创建应收账款
            const result = await this.accountsReceivableEntity.create(accountsReceivable);
            accountsReceivable.accountsReceivableId = result.insertId;
            //创建应收账款科目明细
            const accountsReceivableSubjectMx: IAccountsReceivableSubjectMx = {
                accountsReceivableId: accountsReceivable.accountsReceivableId,
                accountsReceivableSubjectMxId: 0,
                correlationId: accountsReceivable.correlationId,
                correlationType: accountsReceivable.correlationType,
                credit: 0,
                debit: accountsReceivable.amounts,
                inDate: accountsReceivable.inDate,
                reMark: "",
                abstract: "",
                creater: accountsReceivable.creater,
                createdAt: accountsReceivable.createdAt,
            }

            await this.createAccountsReceivableSubject(accountsReceivableSubjectMx);
        })
    }

    //创建应收账款凭证
    public async createAccountsReceivableSubject(accountsReceivableSubjectMx: IAccountsReceivableSubjectMx) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            //新增应收账款科目明细
            await this.accountsReceivableSubjectMxService.create(accountsReceivableSubjectMx);

            //新增应收账款明细
            await this.createAccountsReceivableMx(accountsReceivableSubjectMx)

            //重新计算应收账款
            await this.recalculateAccountsReceivable(accountsReceivableSubjectMx.accountsReceivableId);
        })
    }

    //按相关单删除应收账款
    public async deleteByCorrelation(correlationId: number, correlationType: number) {
        const accountReceivableList = await this.find({
            accountsReceivableId: 0,
            accountsReceivableType: null,
            clientid: 0,
            correlationId: correlationId,
            correlationType: correlationType,
            startDate: "",
            endDate: "",
            page: 0,
            pagesize: 0,
        });


        for (let i = 0; i < accountReceivableList.length; i++) {
            const accountReceivable = accountReceivableList[i];
            if (accountReceivable.checkedAmounts === 0) {
                await this.accountsReceivableEntity.deleteById(accountReceivable.accountsReceivableId);
            }else{
                return Promise.reject(new Error("删除应收账款失败,有已核销数"));
            }
        }

        await this.accountsReceivableMxService.deleteByCorrelation(correlationId, correlationType);
        await this.accountsReceivableSubjectMxService.deleteByCorrelation(correlationId, correlationType);
    }

    //按相关单删除应收账款明细
    public async deleteMxByCorrelation(correlationId: number, correlationType: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            //查询明细 按相关单号 删除后重新计算应收账款
            await this.accountsReceivableMxService.deleteByCorrelation(correlationId, correlationType);
            await this.accountsReceivableSubjectMxService.deleteByCorrelation(correlationId, correlationType);
            const accountReceivableList = await this.find({
                accountsReceivableId: 0,
                accountsReceivableType: null,
                clientid: 0,
                correlationId: correlationId,
                correlationType: correlationType,
                startDate: "",
                endDate: "",
                page: 0,
                pagesize: 0,
            })

            for (let i = 0; i < accountReceivableList.length; i++) {
                await this.recalculateAccountsReceivable(accountReceivableList[i].accountsReceivableId);
            }
        })
    }

    //新增应收账款明细
    private async createAccountsReceivableMx(accountsReceivableSubjectMx: IAccountsReceivableSubjectMx) {

        const accountsReceivableMx: IAccountsReceivableMx = {
            accountReceivableMxId: 0,
            accountsReceivableId: accountsReceivableSubjectMx.accountsReceivableId,
            inDate: accountsReceivableSubjectMx.inDate,
            correlationId: accountsReceivableSubjectMx.correlationId,
            correlationType: accountsReceivableSubjectMx.correlationType,
            actuallyReceived: 0,
            advancesReceived: 0,
            receivables: 0,
            abstract: "",
            reMark: "",
            creater: accountsReceivableSubjectMx.creater,
            createdAt: accountsReceivableSubjectMx.createdAt,
            updater: "",
            updatedAt: null,
        }

        const accountsReceivable = await this.findById(accountsReceivableSubjectMx.accountsReceivableId)

        switch (accountsReceivable.accountsReceivableType) {
            //应收账款
            case AccountCategoryType.accountsReceivable | AccountCategoryType.otherReceivables:
                //借方增加,应付账款增加
                if (accountsReceivableSubjectMx.debit) {
                    accountsReceivableMx.receivables = accountsReceivableSubjectMx.debit;
                }

                //贷方增加,实收增加
                if (accountsReceivableSubjectMx.credit) {
                    accountsReceivableMx.advancesReceived = accountsReceivableSubjectMx.credit;
                }
                break;
                //预收账款
            case AccountCategoryType.advancePayment:
                //借方+,预收账款+
                if (accountsReceivableSubjectMx.debit) {
                    accountsReceivableMx.advancesReceived = accountsReceivableSubjectMx.debit;
                }
                //贷方-,预收账款-
                if (accountsReceivableSubjectMx.credit) {
                    accountsReceivableMx.advancesReceived = -accountsReceivableSubjectMx.credit
                }
                break;
            default:
                break
        }
        await this.accountsReceivableMxService.create(accountsReceivableMx);
    }

    //重新计算应收账款核销金额
    private async recalculateAccountsReceivable(accountsReceivableId: number) {
        const accountsReceivable = await this.findById(accountsReceivableId);
        const accountsReceivableSubjectMxList = await this.accountsReceivableSubjectMxService.findById(accountsReceivableId);
        const amounts = accountsReceivable.amounts;
        let checkedAmounts: number;
        let notCheckAmounts: number = 0;

        // 借方 + 贷方
        for (let i = 0; i < accountsReceivableSubjectMxList.length; i++) {
            const accountsReceivableSubjectMx = accountsReceivableSubjectMxList[i];
            notCheckAmounts = Number(
                round(
                    chain(bignumber(notCheckAmounts))
                        .add(bignumber(accountsReceivableSubjectMx.debit))
                        .add(bignumber(accountsReceivableSubjectMx.credit))
                        .done(), 4)
            );
        }

        checkedAmounts = Number(
            round(
                chain(bignumber(amounts))
                    .subtract(bignumber(notCheckAmounts))
                    .done(), 4)
        );
        accountsReceivable.checkedAmounts = checkedAmounts;
        accountsReceivable.notCheckAmounts = notCheckAmounts;
        await this.accountsReceivableEntity.update(accountsReceivable);
    }

}