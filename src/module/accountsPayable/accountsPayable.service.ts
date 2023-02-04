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
                accountsPayableSubjectMxId: 0,
                accountsPayableId: accountsPayable.accountsPayableId,
                inDate: accountsPayable.inDate,
                correlationId: accountsPayable.correlationId,
                correlationType: accountsPayable.correlationType,
                credit: 0,
                debit: 0,
                reMark: "",
                abstract: "",
                creater: accountsPayable.creater,
                createdAt: accountsPayable.createdAt,
            }

            switch (accountsPayable.accountsPayableType) {
                //预付账款5 资产类 借增 贷减
                case AccountCategoryType.prepayments5:
                    if (accountsPayable.amounts > 0) {
                        accountsPayableSubjectMx.debit = accountsPayable.amounts;
                    } else if (accountsPayable.amounts < 0) {
                        accountsPayableSubjectMx.credit = Math.abs(accountsPayable.amounts);
                    }
                    break;
                //应付账款4 || 其他应付5 负债类 贷增 借减
                case AccountCategoryType.accountsPayable4:
                    if (accountsPayable.amounts > 0) {
                        //正数贷方 负债类 贷方增加
                        accountsPayableSubjectMx.credit = accountsPayable.amounts;
                    } else if (accountsPayable.amounts < 0) {
                        accountsPayableSubjectMx.debit = Math.abs(accountsPayable.amounts);
                    }
                    break;
                case AccountCategoryType.otherPayable6:
                    if (accountsPayable.amounts > 0) {
                        //正数贷方 负债类 贷方增加
                        accountsPayableSubjectMx.credit = accountsPayable.amounts;
                    } else if (accountsPayable.amounts < 0) {
                        accountsPayableSubjectMx.debit = Math.abs(accountsPayable.amounts);
                    }
                    break;
                default:
                    break;
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
            correlationCode: "",
            amounts: 0, checkedAmounts: 0, notCheckAmounts: 0,
            accountsPayableId: 0,
            accountsPayableTypeList: undefined,
            buyid: 0,
            correlationId: correlationId,
            correlationType: correlationType,
            startDate: "",
            endDate: "",
            page: 0,
            pagesize: 0
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
            //删除Mx
            await this.accountsPayableMxService.deleteByCorrelationId(correlationId, correlationType);

            //查询单据产生的凭证
            const accountsPayableSubjectMxList = await this.accountsPayableSubjectMxService.findByCorrelation(correlationId, correlationType);

            //如果有凭证
            if (accountsPayableSubjectMxList && accountsPayableSubjectMxList.length > 0) {
                //删除相关凭证
                await this.accountsPayableSubjectMxService.deleteByCorrelation(correlationId, correlationType);

                //需要重新计算应付账款ID列表
                let needsToBeRecalculatedAccountsPayableIdList: number[] = [];
                for (let i = 0; i < accountsPayableSubjectMxList.length; i++) {
                    if (accountsPayableSubjectMxList[i].accountsPayableId !== 0) {
                        needsToBeRecalculatedAccountsPayableIdList.push(accountsPayableSubjectMxList[i].accountsPayableId);
                    }
                }
                //id去重
                needsToBeRecalculatedAccountsPayableIdList = Array.from(new Set(needsToBeRecalculatedAccountsPayableIdList));

                //根据凭证id刷新应付账款未核销数
                for (let i = 0; i < needsToBeRecalculatedAccountsPayableIdList.length; i++) {
                    await this.recalculateAccountPayable(needsToBeRecalculatedAccountsPayableIdList[i]);
                }
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
            case AccountCategoryType.accountsPayable4:
                //负债类 贷方增加
                if (accountsPayableSubjectMx.credit > 0) {
                    //贷方正数 应付款 增加
                    accountsPayableMx.accountPayable = accountsPayableSubjectMx.credit;
                } else if (accountsPayableSubjectMx.credit < 0) {
                    //贷方负数 应付款 减少
                    accountsPayableMx.accountPayable = accountsPayableSubjectMx.credit;
                }

                //负债类 借方减少
                if (accountsPayableSubjectMx.debit > 0) {
                    //借方正数 应付款 减少
                    accountsPayableMx.actuallyPayment = accountsPayableSubjectMx.debit;
                } else if (accountsPayableSubjectMx.debit < 0) {
                    //借方负数 应付款 增加
                    accountsPayableMx.accountPayable = Math.abs(accountsPayableSubjectMx.debit)
                }
                break;
            case AccountCategoryType.otherPayable6:
                //负债类 贷方增加
                if (accountsPayableSubjectMx.credit > 0) {
                    //贷方正数 应付款 增加
                    accountsPayableMx.accountPayable = accountsPayableSubjectMx.credit;
                } else if (accountsPayableSubjectMx.credit < 0) {
                    //贷方负数 应付款 减少
                    accountsPayableMx.accountPayable = accountsPayableSubjectMx.credit;
                }

                //负债类 借方减少
                if (accountsPayableSubjectMx.debit > 0) {
                    //借方正数 应付款 减少
                    accountsPayableMx.actuallyPayment = accountsPayableSubjectMx.debit;
                } else if (accountsPayableSubjectMx.debit < 0) {
                    //借方负数 应付款 增加
                    accountsPayableMx.accountPayable = Math.abs(accountsPayableSubjectMx.debit)
                }
                break;
            case AccountCategoryType.prepayments5:
                //资产类 借方增加
                if (accountsPayableSubjectMx.debit > 0) {
                    accountsPayableMx.advancesPayment = accountsPayableSubjectMx.debit;
                } else if (accountsPayableSubjectMx.debit < 0) {
                    accountsPayableMx.advancesPayment = accountsPayableSubjectMx.debit;
                }

                if (accountsPayableSubjectMx.credit > 0) {
                    accountsPayableMx.advancesPayment = -accountsPayableSubjectMx.credit;
                } else if (accountsPayableSubjectMx.credit < 0) {
                    accountsPayableMx.advancesPayment = Math.abs(accountsPayableSubjectMx.credit);
                }
                break;
            default:
                break;
        }
        await this.accountsPayableMxService.create(accountsPayableMx);
    }

    //重新计算应付账款
    private async recalculateAccountPayable(accountsPayableId: number) {
        const accountsPayable = await this.findById(accountsPayableId);
        const accountsPayableSubjectMxList = await this.accountsPayableSubjectMxService.findById(accountsPayableId);

        if (accountsPayableSubjectMxList.length === 0) {
            return
        }

        const amounts = accountsPayable.amounts;
        let checkedAmounts: number;
        let notCheckAmounts: number = 0;

        for (let i = 0; i < accountsPayableSubjectMxList.length; i++) {


            const accountsPayableSubjectMx = accountsPayableSubjectMxList[i];

            switch (accountsPayable.accountsPayableType) {
                case AccountCategoryType.otherPayable6:
                    notCheckAmounts = Number(
                        round(
                            chain(bignumber(notCheckAmounts))
                                .add(bignumber(accountsPayableSubjectMx.credit))
                                .subtract(bignumber(accountsPayableSubjectMx.debit))
                                .done(), 4)
                    );
                    break;
                //应付账款 其他应付 负债类 贷增借减
                case AccountCategoryType.accountsPayable4:
                    notCheckAmounts = Number(
                        round(
                            chain(bignumber(notCheckAmounts))
                                .add(bignumber(accountsPayableSubjectMx.credit))
                                .subtract(bignumber(accountsPayableSubjectMx.debit))
                                .done(), 4)
                    );
                    break;
                //预付账款 资产类 借增 贷减
                case AccountCategoryType.prepayments5:
                    notCheckAmounts = Number(
                        round(
                            chain(bignumber(notCheckAmounts))
                                .add(bignumber(accountsPayableSubjectMx.debit))
                                .subtract(bignumber(accountsPayableSubjectMx.credit))
                                .done(), 4)
                    );
                    break;
                default:
                    break;
            }
        }

        await AccountsPayableService.notCheckAmountsCannotBeNegative(notCheckAmounts);

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
}