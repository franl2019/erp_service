import {AccountsPayableEntity} from "./accountsPayable.entity";
import {AccountsPayableFindDto} from "./dto/accountsPayableFind.dto";
import {IAccountsPayable} from "./accountsPayable";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {Injectable} from "@nestjs/common";
import {AccountsPayableMxService} from "../accountsPayableMx/accountsPayableMx.service";
import {AccountsPayableSubjectMxService} from "../accountsPayableMxSubject/accountsPayableSubjectMx.service";
import {IAccountsPayableSubjectMx} from "../accountsPayableMxSubject/accountsPayableSubjectMx";
import {IAccountsPayableMx} from "../accountsPayableMx/accountsPayableMx";
import {AccountCategoryType} from "../accountsVerifySheetMx/accountCategoryType";
import {bignumber, chain, round} from "mathjs";

@Injectable()
export class AccountsPayableService {

    constructor(private readonly mysqldbAls: MysqldbAls, private readonly accountsPayableEntity: AccountsPayableEntity, private readonly accountsPayableMxService: AccountsPayableMxService, private readonly accountsPayableSubjectMxService: AccountsPayableSubjectMxService) {
    }

    public async findById(accountsPayableId: number) {
        return await this.accountsPayableEntity.findById(accountsPayableId);
    }

    public async find(findDto: AccountsPayableFindDto) {
        return await this.accountsPayableEntity.find(findDto);
    }

    public async createAccountPayable(accountsPayable: IAccountsPayable) {

        return this.mysqldbAls.sqlTransaction(async () => {
            const result = await this.accountsPayableEntity.create(accountsPayable);
            accountsPayable.accountsPayableId = result.insertId;

            const accountsPayableSubjectMx: IAccountsPayableSubjectMx = {
                accountsPayableId: accountsPayable.accountsPayableId,
                accountsPayableSubjectMxId: 0,
                inDate: accountsPayable.inDate,
                correlationId: accountsPayable.correlationId,
                correlationType: accountsPayable.correlationType,
                credit: accountsPayable.amounts,
                debit: 0,
                reMark: "",
                abstract: "",
                creater: accountsPayable.creater,
                createdAt: accountsPayable.createdAt,
            }

            await this.createAccountsPayableSubject(accountsPayableSubjectMx);
        })
    }

    public async createAccountsPayableSubject(accountsPayableSubjectMx: IAccountsPayableSubjectMx) {

        return this.mysqldbAls.sqlTransaction(async () => {
            //新增应付账款科目明细
            await this.accountsPayableSubjectMxService.create(accountsPayableSubjectMx);

            //新增应付账款明细
            await this.createAccountsPayableMx(accountsPayableSubjectMx);

            //重新计算应付账款
            await this.recalculateAccountPayable(accountsPayableSubjectMx.accountsPayableId);
        })
    }

    public async deleteByCorrelation(correlationId: number, correlationType: number) {
        const accountsPayableList = await this.find({
            accountsPayableId: 0,
            accountsPayableType: undefined,
            buyid: 0,
            correlationId: correlationId,
            correlationType: correlationType,
            startDate: "",
            endDate: "",
            page: 0,
            pagesize: 0,
        });

        for (let i = 0; i < accountsPayableList.length; i++) {
            const accountsPayable = accountsPayableList[i];
            if (accountsPayable.checkedAmounts === 0) {
                await this.accountsPayableEntity.deleteById(accountsPayable.accountsPayableId);
            } else {
                return Promise.reject(new Error("删除应付账款失败,有已核销数"));
            }
        }
    }

    public async deleteMxByCorrelation(correlationId: number, correlationType: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            await this.accountsPayableMxService.deleteByCorrelationId(correlationId, correlationType);
            await this.accountsPayableSubjectMxService.deleteByCorrelation(correlationId, correlationType);
            const accountPayableList = await this.find({
                accountsPayableId: 0,
                accountsPayableType: null,
                buyid: 0,
                correlationId: correlationId,
                correlationType: correlationType,
                startDate: "",
                endDate: "",
                page: 0,
                pagesize: 0,
            })

            for (let i = 0; i < accountPayableList.length; i++) {
                await this.recalculateAccountPayable(accountPayableList[i].accountsPayableId);
            }
        })
    }

    private async createAccountsPayableMx(accountsPayableSubjectMx: IAccountsPayableSubjectMx) {

        const accountsPayableMx: IAccountsPayableMx = {
            accountsPayableMxId: 0,
            accountsPayableId: accountsPayableSubjectMx.accountsPayableId,
            correlationId: accountsPayableSubjectMx.correlationId,
            correlationType: accountsPayableSubjectMx.correlationType,
            accountPayable: 0,
            actuallyPayment: 0,
            advancesPayment: 0,
            inDate: accountsPayableSubjectMx.inDate,
            reMark: "",
            abstract: "",
            creater: accountsPayableSubjectMx.creater,
            createdAt: accountsPayableSubjectMx.createdAt,
            updater: "",
            updatedAt: null,
        }

        const accountsPayable = await this.findById(accountsPayableSubjectMx.accountsPayableId);

        switch (accountsPayable.accountsPayableType) {
            //应付账款
            case AccountCategoryType.accountsPayable | AccountCategoryType.otherPayable:
                //借方增加,应付账款增加
                if (accountsPayableSubjectMx.debit) {
                    accountsPayableMx.accountPayable = accountsPayableSubjectMx.debit;
                }

                //贷方增加，实收增加
                if (accountsPayableSubjectMx.credit) {
                    accountsPayableMx.actuallyPayment = accountsPayableSubjectMx.credit
                }
                break;
            case AccountCategoryType.prepayments:
                if (accountsPayableSubjectMx.debit) {
                    accountsPayableMx.advancesPayment = accountsPayableSubjectMx.debit;
                }

                if (accountsPayableSubjectMx.credit) {
                    accountsPayableMx.advancesPayment = -accountsPayableSubjectMx.credit;
                }
                break;
            default:
                break;
        }

    }

    private async recalculateAccountPayable(accountsPayableId: number) {
        const accountsPayable = await this.findById(accountsPayableId);
        const accountsPayableSubjectMxList = await this.accountsPayableSubjectMxService.findById(accountsPayableId);
        const amounts = accountsPayable.amounts;
        let checkedAmounts: number;
        let notCheckAmounts: number = 0;

        for (let i = 0; i < accountsPayableSubjectMxList.length; i++) {
            const accountsPayableSubjectMx = accountsPayableSubjectMxList[i];
            notCheckAmounts = Number(
                round(
                    chain(bignumber(notCheckAmounts))
                        .add(bignumber(accountsPayableSubjectMx.debit))
                        .add(bignumber(accountsPayableSubjectMx.credit))
                        .done(), 4)
            );
        }

        checkedAmounts = Number(
            round(
                chain(bignumber(amounts))
                    .subtract(bignumber(notCheckAmounts))
                    .done(), 4)
        );

        accountsPayable.checkedAmounts = checkedAmounts;
        accountsPayable.notCheckAmounts = notCheckAmounts;

        await this.accountsPayableEntity.update(accountsPayable);
    }
}