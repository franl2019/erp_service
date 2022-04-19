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

    //不能是负数
    private static notCheckAmountsCannotBeNegative(notCheckAmounts: number) {

        //账套,是否能负数
        // if(false){
        //     return true
        // }
        if (notCheckAmounts < 0) {
            return Promise.reject(new Error('未核销数不能为负数'));
        }
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
                debit: 0,
                inDate: accountsReceivable.inDate,
                reMark: "",
                abstract: "",
                creater: accountsReceivable.creater,
                createdAt: accountsReceivable.createdAt,
            }

            switch (accountsReceivable.accountsReceivableType) {
                case AccountCategoryType.advancePayment2:
                    //预收账款 负债类 贷方增加 借方减少
                    if (accountsReceivable.amounts > 0) {
                        accountsReceivableSubjectMx.credit = accountsReceivable.amounts;
                    } else if (accountsReceivable.amounts < 0) {
                        //因为负数所以拿绝对值
                        accountsReceivableSubjectMx.debit = Math.abs(accountsReceivable.amounts);
                    }
                    break;
                case AccountCategoryType.accountsReceivable1 || AccountCategoryType.otherReceivables3:
                    //应收账款 资产类 借方增加 贷方减少
                    if (accountsReceivable.amounts > 0) {
                        accountsReceivableSubjectMx.debit = accountsReceivable.amounts;
                    } else if (accountsReceivable.amounts < 0) {
                        //因为负数所以拿绝对值
                        accountsReceivableSubjectMx.credit = Math.abs(accountsReceivable.amounts);
                    }
                    break;
                default:
                    break;
            }

            await this.createAccountsReceivableSubject(accountsReceivableSubjectMx);
        })
    }

    //创建应收账款凭证
    public async createAccountsReceivableSubject(accountsReceivableSubjectMx: IAccountsReceivableSubjectMx) {

        console.log('创建应收账款凭证subject')
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
            accountsReceivableTypeList: [],
            amounts: 0,
            checkedAmounts: 0,
            notCheckAmounts: 0,
            accountsReceivableId: 0,
            clientid: 0,
            correlationId: correlationId,
            correlationType: correlationType,
            correlationCode: "",
            startDate: "",
            endDate: "",
            page: 0,
            pagesize: 0
        });


        for (let i = 0; i < accountReceivableList.length; i++) {
            const accountReceivable = accountReceivableList[i];
            if (accountReceivable.checkedAmounts === 0) {
                await this.accountsReceivableEntity.deleteById(accountReceivable.accountsReceivableId);
            } else {
                return Promise.reject(new Error("删除应收账款失败,有已核销数"));
            }
        }
    }

    //按相关单删除应收账款明细
    public async deleteMxByCorrelation(correlationId: number, correlationType: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            //删除明细
            await this.accountsReceivableMxService.deleteByCorrelation(correlationId, correlationType);

            const accountsReceivableSubjectMxList = await this.accountsReceivableSubjectMxService.findByCorrelation(correlationId, correlationType);

            if(accountsReceivableSubjectMxList&&accountsReceivableSubjectMxList.length>0){
                await this.accountsReceivableSubjectMxService.deleteByCorrelation(correlationId, correlationType);
            }

            //需要重新计算应收账款ID列表
            let needsToBeRecalculatedAccountsReceivableIdList:number[] = [];
            for (let i = 0; i < accountsReceivableSubjectMxList.length; i++) {
                if(accountsReceivableSubjectMxList[i].accountsReceivableId!==0){
                    needsToBeRecalculatedAccountsReceivableIdList.push(accountsReceivableSubjectMxList[i].accountsReceivableId);
                }
            }
            //id去重
            needsToBeRecalculatedAccountsReceivableIdList = Array.from(new Set(needsToBeRecalculatedAccountsReceivableIdList));

            //根据凭证id刷新应收账款未核销数
            for (let i = 0; i < needsToBeRecalculatedAccountsReceivableIdList.length; i++) {
                await this.recalculateAccountsReceivable(needsToBeRecalculatedAccountsReceivableIdList[i]);
            }
        })
    }

    //新增应收账款明细
    private async createAccountsReceivableMx(accountsReceivableSubjectMx: IAccountsReceivableSubjectMx) {
        console.log('创建应收账款明细mx')

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
            case AccountCategoryType.accountsReceivable1 || AccountCategoryType.otherReceivables3:
                //应收账款 资产类 借方增加 贷方减少
                if (accountsReceivableSubjectMx.debit > 0) {
                    accountsReceivableMx.receivables = accountsReceivableSubjectMx.debit;
                } else if (accountsReceivableSubjectMx.debit < 0) {
                    accountsReceivableMx.receivables = accountsReceivableSubjectMx.debit;
                }

                //应收账款 资产类 借方增加 贷方减少
                if (accountsReceivableSubjectMx.credit > 0) {
                    accountsReceivableMx.actuallyReceived = accountsReceivableSubjectMx.credit;
                } else if (accountsReceivableSubjectMx.credit < 0) {
                    accountsReceivableMx.receivables = Math.abs(accountsReceivableSubjectMx.credit);
                }
                break;
            //预收账款
            case AccountCategoryType.advancePayment2:
                //负债类 贷方增加 借方减少
                if (accountsReceivableSubjectMx.credit > 0) {
                    accountsReceivableMx.advancesReceived = accountsReceivableSubjectMx.credit;
                } else if (accountsReceivableSubjectMx.credit < 0) {
                    accountsReceivableMx.advancesReceived = accountsReceivableSubjectMx.credit;
                }

                if (accountsReceivableSubjectMx.debit > 0) {
                    accountsReceivableMx.advancesReceived = -accountsReceivableSubjectMx.debit;
                } else if (accountsReceivableSubjectMx.debit < 0) {
                    accountsReceivableMx.advancesReceived = Math.abs(accountsReceivableSubjectMx.debit);
                }
                break;
            default:
                console.log('default')
                break
        }
        await this.accountsReceivableMxService.create(accountsReceivableMx);
    }

    //重新计算应收账款核销金额
    private async recalculateAccountsReceivable(accountsReceivableId: number) {
        console.log('重新计算应收账款核销金额')
        const accountsReceivable = await this.findById(accountsReceivableId);
        const accountsReceivableSubjectMxList = await this.accountsReceivableSubjectMxService.findById(accountsReceivableId);

        //没有核销明细不用计算 return
        if (accountsReceivableSubjectMxList.length === 0) {
            return
        }

        const amounts = accountsReceivable.amounts;
        let checkedAmounts: number;
        let notCheckAmounts: number = 0;

        // 借方 + 贷方
        for (let i = 0; i < accountsReceivableSubjectMxList.length; i++) {
            const accountsReceivableSubjectMx = accountsReceivableSubjectMxList[i];

            switch (accountsReceivable.accountsReceivableType) {
                case AccountCategoryType.accountsReceivable1 || AccountCategoryType.otherReceivables3:
                    //应收账款 借方-贷方=余额
                    notCheckAmounts = Number(
                        round(
                            chain(bignumber(notCheckAmounts))
                                .add(bignumber(accountsReceivableSubjectMx.debit))
                                .subtract(bignumber(accountsReceivableSubjectMx.credit))
                                .done(), 4)
                    );
                    break;
                case AccountCategoryType.advancePayment2:
                    //预收账款 贷方-借方=余额
                    notCheckAmounts = Number(
                        round(
                            chain(bignumber(notCheckAmounts))
                                .add(bignumber(accountsReceivableSubjectMx.credit))
                                .subtract(bignumber(accountsReceivableSubjectMx.debit))
                                .done(), 4)
                    );
                    break;
                default:
                    break;
            }

        }

        await AccountsReceivableService.notCheckAmountsCannotBeNegative(notCheckAmounts);

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