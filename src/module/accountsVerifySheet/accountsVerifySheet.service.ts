import {Injectable} from "@nestjs/common";
import {AccountsVerifySheetEntity} from "./accountsVerifySheet.entity";
import {AccountsVerifySheetFindDto} from "./dto/accountsVerifySheetFind.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {AccountsVerifySheetCreateDto} from "./dto/accountsVerifySheetCreate.dto";
import {AccountsVerifySheetMxCreateDto} from "./dto/accountsVerifySheetMxCreate.dto";
import {verifyParam} from "../../utils/verifyParam";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {AccountsVerifySheetUpdateDto} from "./dto/accountsVerifySheetUpdate.dto";
import {AccountsVerifySheetMxUpdateDto} from "./dto/accountsVerifySheetMxUpdate.dto";
import {AccountsVerifySheetMxService} from "../accountsVerifySheetMx/accountsVerifySheetMx.service";
import {AccountsPayableService} from "../accountsPayable/accountsPayable.service";
import {IAccountsVerifySheetMx} from "../accountsVerifySheetMx/accountsVerifySheetMx";
import {AccountsReceivableService} from "../accountsReceivable/accountsReceivable.service";
import {AccountsPayableMxService} from "../accountsPayableMx/accountsPayableMx.service";
import {AccountsReceivableMxService} from "../accountsReceivableMx/accountsReceivableMx.service";
import {bignumber, chain, equal, round} from "mathjs";
import {AccountsVerifySheetType} from "./accountsVerifySheetType";
import {AccountCategoryType} from "../accountsVerifySheetMx/accountCategoryType";
import {CodeType} from "../autoCode/codeType";
import {IAccountsVerifySheet} from "./accountsVerifySheet";
import {IAccountsReceivable} from "../accountsReceivable/accountsReceivable";
import {IAccountsReceivableSubjectMx} from "../accountsReceivableSubjectMx/accountsReceivableSubjectMx";
import {IAccountsPayable} from "../accountsPayable/accountsPayable";
import {IAccountsPayableSubjectMx} from "../accountsPayableMxSubject/accountsPayableSubjectMx";

@Injectable()
export class AccountsVerifySheetService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly accountsVerifySheetEntity: AccountsVerifySheetEntity,
        private readonly accountsVerifySheetMxService: AccountsVerifySheetMxService,
        private readonly accountsPayableService: AccountsPayableService,
        private readonly accountsPayableMxService: AccountsPayableMxService,
        private readonly accountsReceivableService: AccountsReceivableService,
        private readonly accountsReceivableMxService: AccountsReceivableMxService,
        private readonly autoCodeMxService: AutoCodeMxService,
    ) {
    }

    public async findById(accountsVerifySheetId: number) {
        return await this.accountsVerifySheetEntity.findById(accountsVerifySheetId);
    }

    public async find(findDto: AccountsVerifySheetFindDto) {
        return await this.accountsVerifySheetEntity.find(findDto);
    }

    public async create(createDto: AccountsVerifySheetCreateDto) {
        const accountsVerifySheetMxList: AccountsVerifySheetMxCreateDto[] = [];
        if (createDto.accountsVerifySheetMx.length > 0) {
            for (let i = 0; i < createDto.accountsVerifySheetMx.length; i++) {
                const accountsVerifySheetMx = new AccountsVerifySheetMxCreateDto(createDto.accountsVerifySheetMx[i]);
                await verifyParam(accountsVerifySheetMx);
                accountsVerifySheetMxList.push(accountsVerifySheetMx);
            }
        } else {
            return Promise.reject(new Error('核销单明细为空，无法保存'));
        }

        return await this.mysqldbAls.sqlTransaction(async () => {
            createDto.accountsVerifySheetCode = await this.autoCodeMxService.getAutoCode(CodeType.HXD);
            const result = await this.accountsVerifySheetEntity.create(createDto);
            await this.accountsVerifySheetMxService.create(accountsVerifySheetMxList);
            return result;
        })
    }

    public async update(updateDto: AccountsVerifySheetUpdateDto) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            //是否未审核
            const accountsVerifySheet = await this.findById(updateDto.accountsVerifySheetId);
            if (accountsVerifySheet.level1Review !== 0 && accountsVerifySheet.level2Review !== 0) {
                return Promise.reject(new Error('更新核销单失败,单据已审核'));
            }

            //检查明细格式
            const accountsVerifySheetMxList: AccountsVerifySheetMxUpdateDto[] = [];
            if (updateDto.accountsVerifySheetMx.length > 0) {
                for (let i = 0; i < updateDto.accountsVerifySheetMx.length; i++) {
                    const accountsVerifySheetMx = updateDto.accountsVerifySheetMx[i];
                    await verifyParam(accountsVerifySheetMx);
                    accountsVerifySheetMxList.push(accountsVerifySheetMx);
                }
            } else {
                return Promise.reject(new Error('更新核销单失败,单据缺少明细'));
            }

            //更新单头，删除明细，更新明细
            const result = await this.accountsVerifySheetEntity.update(updateDto);
            await this.accountsVerifySheetMxService.delete_data(updateDto.accountsVerifySheetId);
            await this.accountsVerifySheetMxService.create(accountsVerifySheetMxList);
            return result;
        })
    }

    public async delete_data(accountsVerifySheetId: number, userName: string) {

        return this.mysqldbAls.sqlTransaction(async () => {
            //是否未审核
            const accountsVerifySheet = await this.findById(accountsVerifySheetId);
            if (accountsVerifySheet.level1Review !== 0 && accountsVerifySheet.level2Review !== 0) {
                return Promise.reject(new Error('删除核销单失败,单据已审核'));
            }

            await this.accountsVerifySheetEntity.delete_data(accountsVerifySheetId, userName);
            await this.accountsVerifySheetMxService.delete_data(accountsVerifySheetId);
        })

    }

    public async level1Review(accountsVerifySheetId: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async () => {

            //是否未审核
            const accountsVerifySheet = await this.findById(accountsVerifySheetId);
            if (accountsVerifySheet.level1Review !== 0 && accountsVerifySheet.level2Review !== 0) {
                return Promise.reject(new Error('审核失败,单据已审核'));
            }

            //获取明细
            const accountsVerifySheetMxList = await this.accountsVerifySheetMxService.find({
                accountsVerifySheetId: accountsVerifySheetId, accountsVerifySheetMxId: 0
            })

            //验证核销金额是否一致
            await AccountsVerifySheetService.writeOffAmountWhetherEqual(accountsVerifySheet, accountsVerifySheetMxList);

            //根据账款类型更新应付账款和应付账款明细
            switch (accountsVerifySheet.sheetType) {
                // [1]预收冲应收
                case AccountsVerifySheetType.yuShouChongYinShou: {
                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        //预收账款
                        if (accountsVerifySheetMx.correlationType === AccountCategoryType.advancePayment) {
                            await this.writeOffAccountsReceivableSheetMx(accountsVerifySheet, accountsVerifySheetMx);
                        } else if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsReceivable) {
                            await this.writeOffAccountsReceivableSheetMx(accountsVerifySheet, accountsVerifySheetMx);
                            //本次冲尾数更新
                            if (!equal(bignumber(accountsVerifySheetMx.amountsMantissa), 0)) {
                                await this.writeOffAccountsReceivableSheetMxMantissa(accountsVerifySheet, accountsVerifySheetMx);
                            }
                        }
                    }
                }
                    break;
                // [2]预付冲应付
                case AccountsVerifySheetType.yuFuChongYinFu:
                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        //预付账款
                        if (accountsVerifySheetMx.correlationType === AccountCategoryType.prepayments) {
                            await this.writeOffAccountsPayableSheetMx(accountsVerifySheet, accountsVerifySheetMx);
                        }
                        //预收账款
                        else if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsPayable) {
                            //本次核销
                            await this.writeOffAccountsPayableSheetMx(accountsVerifySheet, accountsVerifySheetMx);
                            //本次冲尾数
                            if (!equal(bignumber(accountsVerifySheetMx.amountsMantissa), 0)) {
                                await this.writeOffAccountsPayableSheetMxMantissa(accountsVerifySheet, accountsVerifySheetMx);
                            }
                        }
                    }
                    break;
                // [3]应收冲应付
                case AccountsVerifySheetType.yinShouChongYinFu: {
                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        //应收账款
                        if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsReceivable) {
                            await this.writeOffAccountsReceivableSheetMx(accountsVerifySheet, accountsVerifySheetMx);
                            if (!equal(bignumber(accountsVerifySheetMx.amountsMantissa), 0)) {
                                await this.writeOffAccountsReceivableSheetMxMantissa(accountsVerifySheet, accountsVerifySheetMx);
                            }
                        }
                        //应付账款
                        else if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsPayable) {
                            await this.writeOffAccountsPayableSheetMx(accountsVerifySheet, accountsVerifySheetMx);
                            if (!equal(bignumber(accountsVerifySheetMx.amountsMantissa), 0)) {
                                await this.writeOffAccountsPayableSheetMxMantissa(accountsVerifySheet, accountsVerifySheetMx);
                            }
                        }
                    }

                }
                    break;
                // [4]应收转应收
                case AccountsVerifySheetType.yinShouZhuanYinShou: {
                    //本次转移应收账款
                    let amounts: number = 0;

                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsReceivable) {
                            amounts = amounts + accountsVerifySheetMx.amountsThisVerify;
                            await this.writeOffAccountsReceivableSheetMx(accountsVerifySheet, accountsVerifySheetMx);
                        }
                    }

                    await this.createAccountReceivable(accountsVerifySheet, amounts)
                }
                    break;
                // [5]应付转应付 冲供应商A 供应商B生成   明细A：供应商A应收-
                case AccountsVerifySheetType.yinFuZhuanYinFu:
                    //本次转移应收账款
                    let amounts: number = 0;
                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsPayable) {
                            amounts = Number(
                                round(chain(bignumber(amounts))
                                    .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                    .done(), 4)
                            );
                            await this.writeOffAccountsPayableSheetMx(accountsVerifySheet, accountsVerifySheetMx);
                        }
                    }
                    await this.createAccountPayable(accountsVerifySheet, amounts)
                    break;
            }
            await this.accountsVerifySheetEntity.level1Review(accountsVerifySheetId, userName);
        })
    }

    public async unLevel1Review(accountsVerifySheetId: number) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            //是否审核
            const accountsVerifySheet = await this.findById(accountsVerifySheetId);
            if (accountsVerifySheet.level1Review !== 1 && accountsVerifySheet.level2Review !== 0) {
                return Promise.reject(new Error('撤审失败,单据未审核'));
            }

            //获取明细
            const accountsVerifySheetMxList = await this.accountsVerifySheetMxService.find({
                accountsVerifySheetId: accountsVerifySheetId, accountsVerifySheetMxId: 0
            })

            //是否有核销应付账款
            let haveAccountsPayable: boolean = false;
            //是否有核销应收账款
            let haveAccountReceivable: boolean = false;

            //循环处理核销单明细
            for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                //账款类型
                switch (accountsVerifySheetMx.correlationType) {
                    //[1]应收账款 | [2]预收账款 |  [3]其他应收
                    case AccountCategoryType.accountsReceivable | AccountCategoryType.advancePayment | AccountCategoryType.otherReceivables:
                        haveAccountReceivable = true;
                        break
                    case AccountCategoryType.accountsPayable | AccountCategoryType.prepayments | AccountCategoryType.otherPayable:
                        haveAccountsPayable = true;
                        break
                    default:
                        break;
                }
            }

            if (haveAccountReceivable) {
                //删除应收账款明细，自动重新计算应收账款
                await this.accountsReceivableService.deleteMxByCorrelation(accountsVerifySheetId, CodeType.HXD);
            }

            if (haveAccountsPayable) {
                //删除应付账款明细，自动重新计算应付账款
                await this.accountsPayableService.deleteMxByCorrelation(accountsVerifySheetId, CodeType.HXD);
            }

            //处理 [4]应收转应收 [5]应付转应付
            switch (accountsVerifySheet.sheetType) {
                //[4]应收转应收 冲客户A 生成客户B
                case 4:
                    await this.accountsReceivableService.deleteByCorrelation(accountsVerifySheet.accountsVerifySheetId, CodeType.HXD);
                    break;
                //[5]应付转应付 冲供应商A 供应商B生成
                case 5:
                    await this.accountsPayableService.deleteByCorrelation(accountsVerifySheet.accountsVerifySheetId, CodeType.HXD);
                    break;
                default:
                    break;
            }

            //更新单据审核状态
            await this.accountsVerifySheetEntity.unLevel1Review(accountsVerifySheetId);
        })

    }

    //核销单核销金额是否相等
    private static async writeOffAmountWhetherEqual(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMxList: IAccountsVerifySheetMx[]) {
        //预收账款本次核销
        let writeOffAmountsA: number = 0;

        //应收账款本次核销
        let writeOffAmountsB: number = 0;

        switch (accountsVerifySheet.sheetType) {
            case AccountsVerifySheetType.yuShouChongYinShou:
                for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                    const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                    //预收账款 本次核销相加
                    if (accountsVerifySheetMx.correlationType === AccountCategoryType.advancePayment) {
                        writeOffAmountsA = Number(
                            round(chain(bignumber(writeOffAmountsA))
                                .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                .done(), 4)
                        );
                    }

                    //应收账款 本次核销相加
                    if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsReceivable) {
                        writeOffAmountsB = Number(
                            round(chain(bignumber(writeOffAmountsB))
                                .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                .done(), 4)
                        );
                    }
                }
                break;
            case AccountsVerifySheetType.yuFuChongYinFu:
                //合计
                for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                    const accountsVerifySheetMx = accountsVerifySheetMxList[i];

                    //预付账款 本次核销相加
                    if (accountsVerifySheetMx.correlationType === AccountCategoryType.prepayments) {
                        writeOffAmountsA = Number(
                            round(chain(bignumber(writeOffAmountsA))
                                .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                .done(), 4)
                        );
                    }

                    //应付账款 本次核销相加
                    if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsPayable) {
                        writeOffAmountsB = Number(
                            round(chain(bignumber(writeOffAmountsB))
                                .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                .done(), 4)
                        );
                    }
                }
                break;
            case AccountsVerifySheetType.yinShouChongYinFu:
                for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                    const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                    if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsReceivable) {
                        writeOffAmountsA = Number(
                            round(chain(bignumber(writeOffAmountsA))
                                .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                .done(), 4)
                        );
                    }

                    if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsPayable) {
                        writeOffAmountsB = Number(
                            round(chain(bignumber(writeOffAmountsB))
                                .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                .done(), 4)
                        );
                    }
                }
                break;
            default:
                break;
        }

        if (equal(bignumber(writeOffAmountsA), bignumber(writeOffAmountsB))) {
            return true;
        } else {
            return Promise.reject(new Error("审核失败,核销明细金额不一致"))
        }
    }

    //核销单创建应收账款
    private async createAccountReceivable(accountsVerifySheet: IAccountsVerifySheet, amounts: number) {
        //创建客户B的应收账款
        const accountsReceivable: IAccountsReceivable = {
            accountsReceivableId: 0,
            accountsReceivableType: AccountCategoryType.accountsReceivable,
            clientid: accountsVerifySheet.clientid_b,
            amounts: amounts,
            checkedAmounts: 0,
            notCheckAmounts: amounts,
            inDate: accountsVerifySheet.inDate,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
            updater: "",
            updatedAt: null,
            del_uuid: 0,
            deletedAt: null,
            deleter: ""
        }
        await this.accountsReceivableService.createAccountsReceivable(accountsReceivable);
    }

    //核销单创建应付账款
    private async createAccountPayable(accountsVerifySheet: IAccountsVerifySheet, amounts: number) {
        const accountsPayable: IAccountsPayable = {
            accountsPayableId: 0,
            accountsPayableType: AccountCategoryType.accountsPayable,
            buyid: accountsVerifySheet.buyid_b,
            amounts: amounts,
            checkedAmounts: 0,
            notCheckAmounts: amounts,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            inDate: accountsVerifySheet.inDate,
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
            updater: "",
            updatedAt: null,
            del_uuid: 0,
            deletedAt: null,
            deleter: ""
        }

        await this.accountsPayableService.createAccountPayable(accountsPayable);
    }

    //核销单应收账款明细核销
    private async writeOffAccountsReceivableSheetMx(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMx: IAccountsVerifySheetMx) {
        const accountsReceivableSubjectMx: IAccountsReceivableSubjectMx = {
            accountsReceivableSubjectMxId: 0,
            accountsReceivableId: accountsVerifySheetMx.correlationId,
            inDate: accountsVerifySheet.inDate,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            debit: 0,
            credit: accountsVerifySheetMx.amountsThisVerify,
            abstract: "",
            reMark: "",
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
        }
        await this.accountsReceivableService.createAccountsReceivableSubject(accountsReceivableSubjectMx);
    }

    //核销单应收账款明细核销冲尾数
    private async writeOffAccountsReceivableSheetMxMantissa(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMx: IAccountsVerifySheetMx) {
        const accountsReceivableSubjectMx: IAccountsReceivableSubjectMx = {
            accountsReceivableSubjectMxId: 0,
            accountsReceivableId: accountsVerifySheetMx.correlationId,
            inDate: accountsVerifySheet.inDate,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            credit: 0,
            debit: -Math.abs(accountsVerifySheetMx.amountsMantissa),
            abstract: "",
            reMark: "",
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
        }
        await this.accountsReceivableService.createAccountsReceivableSubject(accountsReceivableSubjectMx);
    }

    //核销单应付账款明细核销
    private async writeOffAccountsPayableSheetMx(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMx: IAccountsVerifySheetMx) {
        const accountsPayableSubjectMx: IAccountsPayableSubjectMx = {
            accountsPayableSubjectMxId: 0,
            accountsPayableId: accountsVerifySheetMx.correlationId,
            inDate: accountsVerifySheet.inDate,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            debit: 0,
            credit: accountsVerifySheetMx.amountsThisVerify,
            abstract: "",
            reMark: "",
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
        }
        await this.accountsPayableService.createAccountsPayableSubject(accountsPayableSubjectMx);
    }

    //核销单应付账款明细核销冲尾数
    private async writeOffAccountsPayableSheetMxMantissa(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMx: IAccountsVerifySheetMx) {
        const accountsPayableSubjectMx: IAccountsPayableSubjectMx = {
            accountsPayableSubjectMxId: 0,
            accountsPayableId: accountsVerifySheetMx.correlationId,
            inDate: accountsVerifySheet.inDate,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            debit: 0,
            credit: accountsVerifySheetMx.amountsThisVerify,
            abstract: "",
            reMark: "",
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
        }
        await this.accountsPayableService.createAccountsPayableSubject(accountsPayableSubjectMx);
    }
}