import {bignumber, chain, equal, round} from "mathjs";
import {CodeType} from "../autoCode/codeType";
import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {useVerifyParam} from "../../utils/verifyParam/useVerifyParam";
import {IAccountsPayable} from "../accountsPayable/accountsPayable";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {AccountCategoryType} from "../accountsVerifySheetMx/accountCategoryType";
import {IAccountsReceivable} from "../accountsReceivable/accountsReceivable";
import {IAccountsVerifySheet} from "./accountsVerifySheet";
import {AccountsPayableService} from "../accountsPayable/accountsPayable.service";
import {IAccountsVerifySheetMx} from "../accountsVerifySheetMx/accountsVerifySheetMx";
import {AccountsVerifySheetType} from "./accountsVerifySheetType";
import {AccountsPayableMxService} from "../accountsPayableMx/accountsPayableMx.service";
import {IAccountsPayableSubjectMx} from "../accountsPayableMxSubject/accountsPayableSubjectMx";
import {AccountsReceivableService} from "../accountsReceivable/accountsReceivable.service";
import {AccountsVerifySheetEntity} from "./accountsVerifySheet.entity";
import {AccountsVerifySheetFindDto} from "./dto/accountsVerifySheetFind.dto";
import {AccountsVerifySheetMxService} from "../accountsVerifySheetMx/accountsVerifySheetMx.service";
import {AccountsVerifySheetCreateDto} from "./dto/accountsVerifySheetCreate.dto";
import {AccountsVerifySheetUpdateDto} from "./dto/accountsVerifySheetUpdate.dto";
import {IAccountsReceivableSubjectMx} from "../accountsReceivableSubjectMx/accountsReceivableSubjectMx";
import {AccountsVerifySheetMxCreateDto} from "./dto/accountsVerifySheetMxCreate.dto";
import {AccountsVerifySheetMxUpdateDto} from "./dto/accountsVerifySheetMxUpdate.dto";

@Injectable()
export class AccountsVerifySheetService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly accountsPayableService: AccountsPayableService,
        private readonly accountsPayableMxService: AccountsPayableMxService,
        private readonly accountsVerifySheetEntity: AccountsVerifySheetEntity,
        private readonly accountsReceivableService: AccountsReceivableService,
        private readonly accountsVerifySheetMxService: AccountsVerifySheetMxService,
    ) {
    }

    //核销单核销金额是否相等
    private static async amount_isEqual(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMxList: IAccountsVerifySheetMx[]) {
        //预收账款本次核销
        let writeOffAmountsA: number = 0;

        //应收账款本次核销
        let writeOffAmountsB: number = 0;

        switch (accountsVerifySheet.sheetType) {
            case AccountsVerifySheetType.advancePayment_accountsReceivable_1:
                for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                    const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                    //预收账款 本次核销相加
                    if (accountsVerifySheetMx.correlationType === AccountCategoryType.advancePayment2) {
                        writeOffAmountsA = Number(
                            round(chain(bignumber(writeOffAmountsA))
                                .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                .done(), 4)
                        );
                    }

                    //应收账款 本次核销相加
                    if (
                        accountsVerifySheetMx.correlationType === AccountCategoryType.accountsReceivable1 ||
                        accountsVerifySheetMx.correlationType === AccountCategoryType.otherReceivables3
                    ) {
                        writeOffAmountsB = Number(
                            round(chain(bignumber(writeOffAmountsB))
                                .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                .done(), 4)
                        );
                    }
                }
                break;
            case AccountsVerifySheetType.prepayments_accountsPayable_2:
                //合计
                for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                    const accountsVerifySheetMx = accountsVerifySheetMxList[i];

                    //预付账款 本次核销相加
                    if (accountsVerifySheetMx.correlationType === AccountCategoryType.prepayments5) {
                        writeOffAmountsA = Number(
                            round(
                                chain(bignumber(writeOffAmountsA))
                                    .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                    .done()
                                , 4)
                        );
                    }

                    //应付账款 本次核销相加
                    if (
                        accountsVerifySheetMx.correlationType === AccountCategoryType.accountsPayable4 ||
                        accountsVerifySheetMx.correlationType === AccountCategoryType.otherPayable6
                    ) {
                        writeOffAmountsB = Number(
                            round(
                                chain(bignumber(writeOffAmountsB))
                                    .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                    .done()
                                , 4)
                        );
                    }
                }
                break;
            case AccountsVerifySheetType.accountsReceivable_accountsPayable_3:
                for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                    const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                    if (
                        accountsVerifySheetMx.correlationType === AccountCategoryType.accountsReceivable1 ||
                        accountsVerifySheetMx.correlationType === AccountCategoryType.otherReceivables3
                    ) {
                        writeOffAmountsA = Number(
                            round(
                                chain(bignumber(writeOffAmountsA))
                                    .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                    .done()
                                , 4)
                        );
                    }

                    if (
                        accountsVerifySheetMx.correlationType === AccountCategoryType.accountsPayable4 ||
                        accountsVerifySheetMx.correlationType === AccountCategoryType.otherPayable6
                    ) {
                        writeOffAmountsB = Number(
                            round(
                                chain(bignumber(writeOffAmountsB))
                                    .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                    .done()
                                , 4)
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

    public async findById(accountsVerifySheetId: number) {
        return await this.accountsVerifySheetEntity.findById(accountsVerifySheetId);
    }

    public async find(findDto: AccountsVerifySheetFindDto) {
        return await this.accountsVerifySheetEntity.find(findDto);
    }

    public async findAccountsVerifySheetState(findDto: AccountsVerifySheetFindDto) {
        const accountsVerifySheets = await this.accountsVerifySheetEntity.find(findDto);

        let completeL1Review = 0;
        let undoneL1Review = 0;
        let undoneL2Review = 0;
        for (let i = 0; i < accountsVerifySheets.length; i++) {
            const accountExpenditure = accountsVerifySheets[i];
            if (accountExpenditure.level1Review === 0) {
                undoneL1Review = undoneL1Review + 1
            } else if (accountExpenditure.level1Review === 1) {
                completeL1Review = completeL1Review + 1
            }

            if (accountExpenditure.level1Review === 1 && accountExpenditure.level2Review === 0) {
                undoneL2Review = undoneL2Review + 1
            }
        }

        return {
            completeL1Review,
            undoneL1Review,
            undoneL2Review,
        }
    }

    public async create(createDto: AccountsVerifySheetCreateDto): Promise<{ id: number, code: string }> {

        return await this.mysqldbAls.sqlTransaction(async () => {
            createDto.accountsVerifySheetCode = await this.autoCodeMxService.getSheetAutoCode(CodeType.HXD);

            //创建单头
            const result = await this.accountsVerifySheetEntity.create(createDto);

            const accountsVerifySheetMxList: AccountsVerifySheetMxCreateDto[] = [];
            if (createDto.accountsVerifySheetMx.length > 0) {
                for (let i = 0; i < createDto.accountsVerifySheetMx.length; i++) {
                    const accountsVerifySheetMx = new AccountsVerifySheetMxCreateDto(createDto.accountsVerifySheetMx[i]);
                    //给明细关联id
                    accountsVerifySheetMx.accountsVerifySheetId = result.insertId;
                    accountsVerifySheetMx.printId = i;
                    //验证明细参数
                    await useVerifyParam(accountsVerifySheetMx);
                    accountsVerifySheetMxList.push(accountsVerifySheetMx);
                }
            } else {
                return Promise.reject(new Error('核销单明细为空，无法保存'));
            }
            await this.accountsVerifySheetMxService.create(accountsVerifySheetMxList);
            return {
                id: result.insertId,
                code: createDto.accountsVerifySheetCode
            };
        })
    }

    public async create_l1Review(createDto: AccountsVerifySheetCreateDto) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            const createResult = await this.create(createDto);
            await this.level1Review(createResult.id, createDto.creater);
            return createResult
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
                    accountsVerifySheetMx.accountsVerifySheetId = accountsVerifySheet.accountsVerifySheetId;
                    accountsVerifySheetMx.printId = i;
                    await useVerifyParam(accountsVerifySheetMx);
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

    public async update_l1Review(updateDto: AccountsVerifySheetUpdateDto) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            await this.update(updateDto);
            return this.level1Review(updateDto.accountsVerifySheetId, updateDto.updater);
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

            accountsVerifySheet.level1Review = 1
            accountsVerifySheet.level1Date = new Date();
            accountsVerifySheet.level1Name = userName;

            //获取明细
            const accountsVerifySheetMxList = await this.accountsVerifySheetMxService.find({
                accountsVerifySheetId: accountsVerifySheetId
            })

            //验证核销金额是否一致
            await AccountsVerifySheetService.amount_isEqual(accountsVerifySheet, accountsVerifySheetMxList);

            //根据账款类型更新应付账款和应付账款明细
            switch (accountsVerifySheet.sheetType) {
                // [1]预收冲应收
                case AccountsVerifySheetType.advancePayment_accountsReceivable_1: {
                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        //[2]预收账款
                        if (accountsVerifySheetMx.correlationType === AccountCategoryType.advancePayment2) {
                            await this.verify_advancePayment(accountsVerifySheet, accountsVerifySheetMx);
                        } else if (
                            accountsVerifySheetMx.correlationType === AccountCategoryType.accountsReceivable1 ||
                            accountsVerifySheetMx.correlationType === AccountCategoryType.otherReceivables3
                        ) {
                            await this.verify_accountsReceivable(accountsVerifySheet, accountsVerifySheetMx);
                            //本次冲尾数更新
                            if (!equal(bignumber(accountsVerifySheetMx.amountsMantissa), 0)) {
                                await this.verify_accountsReceivable_mantissa(accountsVerifySheet, accountsVerifySheetMx);
                            }
                        }
                    }
                }
                    break;
                // [2]预付冲应付
                case AccountsVerifySheetType.prepayments_accountsPayable_2:
                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        //[5]预付账款
                        if (accountsVerifySheetMx.correlationType === AccountCategoryType.prepayments5) {
                            await this.verify_prepayments(accountsVerifySheet, accountsVerifySheetMx);
                        }
                        //[4]应付账款 ||  [6]其他应付
                        else if (
                            accountsVerifySheetMx.correlationType === AccountCategoryType.accountsPayable4 ||
                            accountsVerifySheetMx.correlationType === AccountCategoryType.otherPayable6
                        ) {
                            //本次核销
                            await this.verify_accountsPayable(accountsVerifySheet, accountsVerifySheetMx);
                            //本次冲尾数
                            if (!equal(bignumber(accountsVerifySheetMx.amountsMantissa), 0)) {
                                await this.verify_accountsPayable_mantissa(accountsVerifySheet, accountsVerifySheetMx);
                            }
                        }
                    }
                    break;
                // [3]应收冲应付
                case AccountsVerifySheetType.accountsReceivable_accountsPayable_3: {
                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        //应收账款
                        if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsReceivable1) {
                            await this.verify_accountsReceivable(accountsVerifySheet, accountsVerifySheetMx);
                            if (!equal(bignumber(accountsVerifySheetMx.amountsMantissa), 0)) {
                                await this.verify_accountsReceivable_mantissa(accountsVerifySheet, accountsVerifySheetMx);
                            }
                        }
                        //应付账款
                        else if (accountsVerifySheetMx.correlationType === AccountCategoryType.accountsPayable4) {
                            await this.verify_accountsPayable(accountsVerifySheet, accountsVerifySheetMx);
                            if (!equal(bignumber(accountsVerifySheetMx.amountsMantissa), 0)) {
                                await this.verify_accountsPayable_mantissa(accountsVerifySheet, accountsVerifySheetMx);
                            }
                        }
                    }

                }
                    break;
                // [4]应收转应收
                case AccountsVerifySheetType.accountsReceivable_accountsReceivable_4: {
                    //本次转移应收账款
                    let amounts: number = 0;

                    //计算转移数,核销转移数
                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        if (
                            accountsVerifySheetMx.correlationType === AccountCategoryType.accountsReceivable1 ||
                            accountsVerifySheetMx.correlationType === AccountCategoryType.otherReceivables3
                        ) {
                            amounts = Number(round(
                                chain(bignumber(amounts))
                                    .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                    .done()
                                , 4
                            ))
                            await this.verify_accountsReceivable(accountsVerifySheet, accountsVerifySheetMx);
                        }
                    }

                    await this.create_accountReceivable(accountsVerifySheet, amounts)
                }
                    break;
                // [5]应付转应付 冲供应商A 供应商B生成   明细A：供应商A应收-
                case AccountsVerifySheetType.accountsPayable_accountsPayable_5:
                    //本次转移应收账款
                    let amounts: number = 0;
                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        if (
                            accountsVerifySheetMx.correlationType === AccountCategoryType.accountsPayable4 ||
                            accountsVerifySheetMx.correlationType === AccountCategoryType.otherPayable6
                        ) {
                            amounts = Number(
                                round(chain(bignumber(amounts))
                                    .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                                    .done(), 4)
                            );
                            await this.verify_accountsPayable(accountsVerifySheet, accountsVerifySheetMx);
                        }
                    }
                    await this.create_accountPayable(accountsVerifySheet, amounts)
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
                accountsVerifySheetId: accountsVerifySheetId
            })

            //是否有核销应收账款
            let haveAccountReceivable: boolean = false;
            //是否有核销应付账款
            let haveAccountsPayable: boolean = false;
            if (accountsVerifySheet.sheetType === AccountsVerifySheetType.advancePayment_accountsReceivable_1 ||
                accountsVerifySheet.sheetType === AccountsVerifySheetType.prepayments_accountsPayable_2 ||
                accountsVerifySheet.sheetType === AccountsVerifySheetType.accountsReceivable_accountsPayable_3
            ) {
                //循环处理核销单明细
                for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                    const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                    //账款类型
                    console.log(accountsVerifySheetMx.correlationType)
                    switch (accountsVerifySheetMx.correlationType) {
                        //[1]应收账款 | [2]预收账款 |  [3]其他应收
                        case AccountCategoryType.accountsReceivable1:
                        case AccountCategoryType.advancePayment2:
                        case AccountCategoryType.otherReceivables3:
                            console.log('haveAccountReceivable')
                            haveAccountReceivable = true;
                            break
                        case AccountCategoryType.accountsPayable4:
                        case AccountCategoryType.prepayments5:
                        case AccountCategoryType.otherPayable6:
                            console.log('accountsPayable')
                            haveAccountsPayable = true;
                            break
                        default:
                            break;
                    }
                }
                //[4]应收转应收 冲客户A 生成客户B
            } else if (accountsVerifySheet.sheetType === AccountsVerifySheetType.accountsReceivable_accountsReceivable_4) {
                // await this.accountsReceivableService.deleteByCorrelation(accountsVerifySheet.accountsVerifySheetId, CodeType.HXD);
                haveAccountReceivable = true;
                //[5]应付转应付 冲供应商A 供应商B生成
            } else if (accountsVerifySheet.sheetType === AccountsVerifySheetType.accountsPayable_accountsPayable_5) {
                // await this.accountsPayableService.deleteByCorrelation(accountsVerifySheet.accountsVerifySheetId, CodeType.HXD);
                haveAccountsPayable = true;
            } else {
                console.log(123)
            }


            if (haveAccountReceivable) {
                console.log('haveAccountReceivable')
                //删除应收账款明细，自动重新计算应收账款
                await this.accountsReceivableService.deleteMxByCorrelation(accountsVerifySheetId, CodeType.HXD);
            }

            if (haveAccountsPayable) {
                //删除应付账款明细，自动重新计算应付账款
                await this.accountsPayableService.deleteMxByCorrelation(accountsVerifySheetId, CodeType.HXD);
            }

            //更新单据审核状态
            await this.accountsVerifySheetEntity.unLevel1Review(accountsVerifySheetId);
        })

    }

    //核销单 创建应收账款
    private async create_accountReceivable(accountsVerifySheet: IAccountsVerifySheet, amounts: number) {
        //创建客户B的应收账款
        const accountsReceivable: IAccountsReceivable = {
            accountsReceivableId: 0,
            accountsReceivableType: AccountCategoryType.accountsReceivable1,
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

    //核销单 创建应付账款
    private async create_accountPayable(accountsVerifySheet: IAccountsVerifySheet, amounts: number) {
        const accountsPayable: IAccountsPayable = {
            accountsPayableId: 0,
            accountsPayableType: AccountCategoryType.accountsPayable4,
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

    //核销 预收账款 负债类 贷方增加 借方减少 核销是借方减少
    private async verify_advancePayment(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMx: IAccountsVerifySheetMx) {
        const accountsReceivableSubjectMx: IAccountsReceivableSubjectMx = {
            accountsReceivableSubjectMxId: 0,
            accountsReceivableId: accountsVerifySheetMx.correlationId,
            inDate: accountsVerifySheet.inDate,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            debit: 0,
            credit: 0,
            abstract: "",
            reMark: "",
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
        }

        if (accountsVerifySheetMx.amountsThisVerify > 0) {
            accountsReceivableSubjectMx.debit = accountsVerifySheetMx.amountsThisVerify
        } else if (accountsVerifySheetMx.amountsThisVerify < 0) {
            accountsReceivableSubjectMx.credit = Math.abs(accountsVerifySheetMx.amountsThisVerify);
        }

        await this.accountsReceivableService.createAccountsReceivableSubject(accountsReceivableSubjectMx);
    }

    //核销 应收账款 资产类 借增 贷减 核销减少贷方
    private async verify_accountsReceivable(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMx: IAccountsVerifySheetMx) {
        const accountsReceivableSubjectMx: IAccountsReceivableSubjectMx = {
            accountsReceivableSubjectMxId: 0,
            accountsReceivableId: accountsVerifySheetMx.correlationId,
            inDate: accountsVerifySheet.inDate,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            debit: 0,
            credit: 0,
            abstract: "",
            reMark: "",
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
        }

        if (accountsVerifySheetMx.amountsThisVerify > 0) {
            accountsReceivableSubjectMx.credit = accountsVerifySheetMx.amountsThisVerify
        } else if (accountsVerifySheetMx.amountsThisVerify < 0) {
            accountsReceivableSubjectMx.debit = Math.abs(accountsVerifySheetMx.amountsThisVerify);
        }

        await this.accountsReceivableService.createAccountsReceivableSubject(accountsReceivableSubjectMx);
    }

    //核销 应收账款冲尾数 资产类 借增 贷减 核销减少贷方
    private async verify_accountsReceivable_mantissa(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMx: IAccountsVerifySheetMx) {
        const accountsReceivableSubjectMx: IAccountsReceivableSubjectMx = {
            accountsReceivableSubjectMxId: 0,
            accountsReceivableId: accountsVerifySheetMx.correlationId,
            inDate: accountsVerifySheet.inDate,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            debit: 0,
            credit: 0,
            abstract: "",
            reMark: "",
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
        }

        if (accountsVerifySheetMx.amountsMantissa > 0) {
            accountsReceivableSubjectMx.credit = accountsVerifySheetMx.amountsMantissa
        } else if (accountsVerifySheetMx.amountsMantissa < 0) {
            accountsReceivableSubjectMx.debit = Math.abs(accountsVerifySheetMx.amountsMantissa);
        }

        await this.accountsReceivableService.createAccountsReceivableSubject(accountsReceivableSubjectMx);
    }

    //核销 预付账款 资产类 借增 贷减 核销减少贷方
    private async verify_prepayments(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMx: IAccountsVerifySheetMx) {
        const accountsPayableSubjectMx: IAccountsPayableSubjectMx = {
            accountsPayableSubjectMxId: 0,
            accountsPayableId: accountsVerifySheetMx.correlationId,
            inDate: accountsVerifySheet.inDate,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            debit: 0,
            credit: 0,
            abstract: "",
            reMark: "",
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
        }

        if (accountsVerifySheetMx.amountsThisVerify > 0) {
            accountsPayableSubjectMx.credit = accountsVerifySheetMx.amountsThisVerify
        } else if (accountsVerifySheetMx.amountsThisVerify < 0) {
            accountsPayableSubjectMx.debit = Math.abs(accountsVerifySheetMx.amountsThisVerify);
        }

        await this.accountsPayableService.createAccountsPayableSubject(accountsPayableSubjectMx);
    }

    //核销 应付账款 负债类 贷方增加 借方减少 核销是借方减少
    private async verify_accountsPayable(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMx: IAccountsVerifySheetMx) {
        const accountsPayableSubjectMx: IAccountsPayableSubjectMx = {
            accountsPayableSubjectMxId: 0,
            accountsPayableId: accountsVerifySheetMx.correlationId,
            inDate: accountsVerifySheet.inDate,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            debit: 0,
            credit: 0,
            abstract: "",
            reMark: "",
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
        }

        if (accountsVerifySheetMx.amountsThisVerify > 0) {
            accountsPayableSubjectMx.debit = accountsVerifySheetMx.amountsThisVerify
        } else if (accountsVerifySheetMx.amountsThisVerify < 0) {
            accountsPayableSubjectMx.credit = Math.abs(accountsVerifySheetMx.amountsThisVerify);
        }

        await this.accountsPayableService.createAccountsPayableSubject(accountsPayableSubjectMx);
    }

    //核销 应付账款冲尾数 负债类 贷方增加 借方减少 核销是借方减少
    private async verify_accountsPayable_mantissa(accountsVerifySheet: IAccountsVerifySheet, accountsVerifySheetMx: IAccountsVerifySheetMx) {
        const accountsPayableSubjectMx: IAccountsPayableSubjectMx = {
            accountsPayableSubjectMxId: 0,
            accountsPayableId: accountsVerifySheetMx.correlationId,
            inDate: accountsVerifySheet.inDate,
            correlationId: accountsVerifySheet.accountsVerifySheetId,
            correlationType: CodeType.HXD,
            debit: 0,
            credit: 0,
            abstract: "",
            reMark: "",
            creater: accountsVerifySheet.level1Name,
            createdAt: accountsVerifySheet.level1Date,
        }

        if (accountsVerifySheetMx.amountsMantissa > 0) {
            accountsPayableSubjectMx.debit = accountsVerifySheetMx.amountsMantissa
        } else if (accountsVerifySheetMx.amountsMantissa < 0) {
            accountsPayableSubjectMx.credit = Math.abs(accountsVerifySheetMx.amountsMantissa);
        }

        await this.accountsPayableService.createAccountsPayableSubject(accountsPayableSubjectMx);
    }


}