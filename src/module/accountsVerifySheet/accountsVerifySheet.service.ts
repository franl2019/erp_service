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
import {bignumber, chain, round} from "mathjs";
import {AccountsVerifySheetType} from "./accountsVerifySheetType";
import {AccountCategory} from "../accountsVerifySheetMx/accountCategory";
import {CodeType} from "../autoCode/codeType";

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
        private readonly autoCodeMxService: AutoCodeMxService
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

            //根据账款类型更新应付账款和应付账款明细
            switch (accountsVerifySheet.sheetType) {
                // [1]预收冲应收 客户A  明细A：预收-  明细B：应收-
                case AccountsVerifySheetType.yuShouChongYinShou: {
                    if (!accountsVerifySheet.clientid) {
                        return Promise.reject(new Error('[1]预收冲应收,缺少客户Id'));
                    }

                    //预收账款本次核销
                    let advancePaymentThisWriteOff: number = 0;

                    //应收账款本次核销
                    let accountsReceivableThisWriteOff: number = 0;

                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        //预收账款 本次核销相加
                        if (accountsVerifySheetMx.correlationType === AccountCategory.advancePayment) {
                            advancePaymentThisWriteOff = advancePaymentThisWriteOff + accountsVerifySheetMx.amountsThisVerify
                        }

                        //应收账款 本次核销相加
                        if (accountsVerifySheetMx.correlationType === AccountCategory.accountsReceivable) {
                            accountsReceivableThisWriteOff = accountsReceivableThisWriteOff + accountsVerifySheetMx.amountsThisVerify
                        }
                    }

                    if (advancePaymentThisWriteOff !== accountsReceivableThisWriteOff) {
                        return Promise.reject(new Error('审核失败,核销单预收账款核销不等于应收账款核销'));
                    }

                    /*
                    * 核销金额一致
                    * 1.更新账款信息
                    * 2.更新账款明细信息
                    * */
                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];

                        //预收款
                        if (accountsVerifySheetMx.correlationType === AccountCategory.advancePayment) {
                            //核销本次核销 更新账款信息
                            await this.accountsReceivableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsThisVerify);
                            //更新账款明细信息
                            await this.accountsReceivableMxService.create({
                                abstract: "",
                                accountReceivableMxId: 0,
                                accountsReceivableId: accountsVerifySheetMx.correlationId,
                                actuallyReceived: 0,
                                advancesReceived: accountsVerifySheetMx.amountsThisVerify * -1,
                                correlationId: accountsVerifySheet.accountsVerifySheetId,
                                correlationType: CodeType.HXD,
                                createdAt: new Date(),
                                creater: userName,
                                inDate: accountsVerifySheet.inDate,
                                reMark: "",
                                receivables: 0,
                                updatedAt: null,
                                updater: ""
                            })
                            continue;
                        }

                        //应收款
                        if (accountsVerifySheetMx.correlationType === AccountCategory.advancePayment) {
                            //更新账款信息
                            //本次核销更新
                            await this.accountsReceivableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsThisVerify);
                            await this.accountsReceivableMxService.create({
                                abstract: "",
                                reMark: "",
                                accountReceivableMxId: 0,
                                accountsReceivableId: accountsVerifySheetMx.correlationId,
                                actuallyReceived: accountsVerifySheetMx.amountsThisVerify,
                                advancesReceived: 0,
                                receivables: 0,
                                correlationId: accountsVerifySheet.accountsVerifySheetId,
                                correlationType: CodeType.HXD,
                                creater: userName,
                                createdAt: new Date(),
                                inDate: accountsVerifySheet.inDate,
                                updater: "",
                                updatedAt: null,
                            })

                            //本次冲尾数更新
                            if (accountsVerifySheetMx.amountsMantissa !== 0) {
                                await this.accountsReceivableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsMantissa);
                                await this.accountsReceivableMxService.create({
                                    abstract: "",
                                    accountReceivableMxId: 0,
                                    accountsReceivableId: accountsVerifySheetMx.correlationId,
                                    actuallyReceived: 0,
                                    advancesReceived: 0,
                                    correlationId: accountsVerifySheet.accountsVerifySheetId,
                                    correlationType: CodeType.HXD,
                                    inDate: accountsVerifySheet.inDate,
                                    reMark: "",
                                    receivables: accountsVerifySheetMx.amountsMantissa * -1,
                                    creater: userName,
                                    createdAt: new Date(),
                                    updater: "",
                                    updatedAt: null
                                })
                            }

                        }
                    }
                }
                    break;
                // [2]预付冲应付 供应商A              明细A：预付-    明细B：应付-
                case AccountsVerifySheetType.yuFuChongYinFu: {
                    if (!accountsVerifySheet.buyid) {
                        return Promise.reject(new Error('[2]预付冲应付,缺少供应商Id'));
                    }
                    //本次核销预付账款
                    let prepaymentsThisWriteOff = 0;

                    //本次核销应付账款
                    let accountsPayableThisWriteOff = 0;

                    //合计
                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];

                        //预付账款 本次核销相加
                        if (accountsVerifySheetMx.correlationType === AccountCategory.prepayments) {
                            prepaymentsThisWriteOff = prepaymentsThisWriteOff + accountsVerifySheetMx.amountsThisVerify
                        }

                        //应付账款 本次核销相加
                        if (accountsVerifySheetMx.correlationType === AccountCategory.accountsPayable) {
                            accountsPayableThisWriteOff = accountsPayableThisWriteOff + accountsVerifySheetMx.amountsThisVerify
                        }
                    }

                    if (prepaymentsThisWriteOff !== accountsPayableThisWriteOff) {
                        return Promise.reject(new Error('审核失败,核销单预付账款核销不等于应付账款核销'));
                    }

                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        //预付账款
                        if (accountsVerifySheetMx.correlationType === AccountCategory.prepayments) {
                            await this.accountsPayableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsThisVerify);
                            await this.accountsPayableMxService.create({
                                abstract: "",
                                accountsPayableMxId: 0,
                                accountsPayableId: accountsVerifySheetMx.correlationId,
                                accountPayable: 0,
                                actuallyPayment: 0,
                                advancesPayment: accountsVerifySheetMx.amountsThisVerify * -1,
                                correlationId: accountsVerifySheet.accountsVerifySheetId,
                                correlationType: CodeType.HXD,
                                inDate: accountsVerifySheet.inDate,
                                reMark: "",
                                creater: userName,
                                createdAt: new Date(),
                                updater: "",
                                updatedAt: null,
                            })
                        }

                        //应付账款
                        if (accountsVerifySheetMx.correlationType === AccountCategory.accountsPayable) {
                            //本次核销
                            await this.accountsPayableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsThisVerify);
                            await this.accountsPayableMxService.create({
                                abstract: "",
                                accountsPayableMxId: 0,
                                accountsPayableId: accountsVerifySheetMx.correlationId,
                                accountPayable: 0,
                                actuallyPayment: accountsVerifySheetMx.amountsThisVerify,
                                advancesPayment: 0,
                                correlationId: accountsVerifySheet.accountsVerifySheetId,
                                correlationType: CodeType.HXD,
                                inDate: accountsVerifySheet.inDate,
                                reMark: "",
                                creater: userName,
                                createdAt: new Date(),
                                updater: "",
                                updatedAt: null,
                            })

                            //本次冲尾数
                            if (accountsVerifySheetMx.amountsMantissa !== 0) {
                                await this.accountsPayableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsMantissa);
                                await this.accountsPayableMxService.create({
                                    abstract: "",
                                    reMark: "",
                                    inDate: accountsVerifySheet.inDate,
                                    accountsPayableMxId: 0,
                                    accountsPayableId: accountsVerifySheetMx.correlationId,
                                    accountPayable: accountsVerifySheetMx.amountsMantissa * -1,
                                    actuallyPayment: 0,
                                    advancesPayment: 0,
                                    correlationId: accountsVerifySheet.accountsVerifySheetId,
                                    correlationType: CodeType.HXD,
                                    creater: userName,
                                    createdAt: new Date(),
                                    updater: "",
                                    updatedAt: undefined,
                                })
                            }
                        }
                    }
                }
                    break;
                // [3]应收冲应付 客户A   供应商A       明细A：客户A应收-  明细B：客户A应收-
                case AccountsVerifySheetType.yinShouChongYinFu: {
                    if (!accountsVerifySheet.clientid || !accountsVerifySheet.buyid) {
                        return Promise.reject(new Error('[3]应收冲应付,缺少客户资料或供应商资料'));
                    }

                    //本次应收账款核销金额
                    let accountsReceivableThisWriteOff: number = 0;

                    //本次应付账款核销金额
                    let accountsPayableThisWriteOff: number = 0;

                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        if (accountsVerifySheetMx.correlationType === AccountCategory.accountsReceivable) {
                            accountsReceivableThisWriteOff = accountsReceivableThisWriteOff + accountsVerifySheetMx.amountsThisVerify;
                        }

                        if (accountsVerifySheetMx.correlationType === AccountCategory.accountsPayable) {
                            accountsPayableThisWriteOff = accountsPayableThisWriteOff + accountsVerifySheetMx.amountsThisVerify;
                        }
                    }

                    if (accountsReceivableThisWriteOff !== accountsPayableThisWriteOff) {
                        return Promise.reject(new Error('审核失败,核销单应收账款核销不等于应付账款核销'));
                    }

                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        //应收账款
                        if (accountsVerifySheetMx.correlationType === AccountCategory.accountsReceivable) {
                            await this.accountsReceivableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsThisVerify);
                            await this.accountsReceivableMxService.create({
                                abstract: "",
                                reMark: "",
                                accountReceivableMxId: 0,
                                accountsReceivableId: accountsVerifySheetMx.correlationId,
                                actuallyReceived: accountsVerifySheetMx.amountsThisVerify,
                                advancesReceived: 0,
                                receivables: 0,
                                correlationId: accountsVerifySheet.accountsVerifySheetId,
                                correlationType: CodeType.HXD,
                                inDate: accountsVerifySheet.inDate,
                                creater: userName,
                                createdAt: new Date(),
                                updater: "",
                                updatedAt: null,
                            })

                            //本次冲尾数
                            if (accountsVerifySheetMx.amountsMantissa !== 0) {
                                await this.accountsReceivableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsMantissa);
                                await this.accountsReceivableMxService.create({
                                    abstract: "",
                                    reMark: "",
                                    accountReceivableMxId: 0,
                                    accountsReceivableId: accountsVerifySheetMx.correlationId,
                                    actuallyReceived: 0,
                                    advancesReceived: 0,
                                    receivables: accountsVerifySheetMx.amountsMantissa * -1,
                                    correlationId: accountsVerifySheet.accountsVerifySheetId,
                                    correlationType: CodeType.HXD,
                                    inDate: accountsVerifySheet.inDate,
                                    creater: userName,
                                    createdAt: new Date(),
                                    updater: "",
                                    updatedAt: null,
                                })
                            }
                        }

                        //应付账款
                        if (accountsVerifySheetMx.correlationType === AccountCategory.accountsPayable) {
                            //本次核销
                            await this.accountsPayableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsThisVerify);
                            await this.accountsPayableMxService.create({
                                abstract: "",
                                accountsPayableMxId: 0,
                                accountsPayableId: accountsVerifySheetMx.correlationId,
                                accountPayable: 0,
                                actuallyPayment: accountsVerifySheetMx.amountsThisVerify,
                                advancesPayment: 0,
                                correlationId: accountsVerifySheet.accountsVerifySheetId,
                                correlationType: CodeType.HXD,
                                inDate: accountsVerifySheet.inDate,
                                reMark: "",
                                creater: userName,
                                createdAt: new Date(),
                                updater: "",
                                updatedAt: null,
                            })

                            //本次冲尾数
                            if (accountsVerifySheetMx.amountsMantissa !== 0) {
                                await this.accountsPayableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsMantissa);
                                await this.accountsPayableMxService.create({
                                    abstract: "",
                                    reMark: "",
                                    inDate: accountsVerifySheet.inDate,
                                    accountsPayableMxId: 0,
                                    accountsPayableId: accountsVerifySheetMx.correlationId,
                                    accountPayable: accountsVerifySheetMx.amountsMantissa * -1,
                                    actuallyPayment: 0,
                                    advancesPayment: 0,
                                    correlationId: accountsVerifySheet.accountsVerifySheetId,
                                    correlationType: CodeType.HXD,
                                    creater: userName,
                                    createdAt: new Date(),
                                    updater: "",
                                    updatedAt: undefined,
                                })
                            }
                        }
                    }

                }
                    break;
                // [4]应收转应收 冲客户A 客户B生成 明细A：客户A应收-
                case AccountsVerifySheetType.yinShouZhuanYinShou: {
                    if (!accountsVerifySheet.clientid || !accountsVerifySheet.clientid_b) {
                        return Promise.reject(new Error('[4]应收转应收,缺少客户A ID或者缺少客户B Id'));
                    }

                    //本次转移应收账款
                    let accountsReceivableThisTransfer: number = 0;

                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        if (accountsVerifySheetMx.correlationType === AccountCategory.accountsReceivable) {
                            accountsReceivableThisTransfer = accountsReceivableThisTransfer + accountsVerifySheetMx.amountsThisVerify;
                            await this.accountsReceivableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsThisVerify);
                            await this.accountsReceivableMxService.create({
                                abstract: "",
                                reMark: "",
                                accountReceivableMxId: 0,
                                accountsReceivableId: accountsVerifySheetMx.correlationId,
                                actuallyReceived: 0,
                                advancesReceived: 0,
                                receivables: accountsVerifySheetMx.amountsThisVerify * -1,
                                inDate: accountsVerifySheet.inDate,
                                correlationId: accountsVerifySheet.accountsVerifySheetId,
                                correlationType: CodeType.HXD,
                                creater: userName,
                                createdAt: new Date(),
                                updater: "",
                                updatedAt: undefined,
                            })
                        }
                    }

                    //创建客户B的应收账款
                    const createAccountsReceivableResult = await this.accountsReceivableService.create({
                        accountsReceivableId: 0,
                        accountsReceivableType: AccountCategory.accountsReceivable,
                        clientid: accountsVerifySheet.clientid_b,
                        amounts: accountsReceivableThisTransfer,
                        checkedAmounts: 0,
                        notCheckAmounts: accountsReceivableThisTransfer,
                        inDate: accountsVerifySheet.inDate,
                        correlationId: accountsVerifySheet.accountsVerifySheetId,
                        correlationType: CodeType.HXD,
                        creater: userName,
                        createdAt: new Date(),
                        updater: "",
                        updatedAt: null,
                        del_uuid: 0,
                        deletedAt: null,
                        deleter: ""
                    })

                    await this.accountsReceivableMxService.create({
                        abstract: "",
                        reMark: "",
                        accountReceivableMxId: 0,
                        accountsReceivableId: createAccountsReceivableResult.insertId,
                        actuallyReceived: 0,
                        advancesReceived: 0,
                        receivables: accountsReceivableThisTransfer,
                        correlationId: accountsVerifySheet.accountsVerifySheetId,
                        correlationType: CodeType.HXD,
                        inDate: accountsVerifySheet.inDate,
                        creater: userName,
                        createdAt: new Date(),
                        updater: "",
                        updatedAt: null,
                    })
                }
                    break;
                // [5]应付转应付 冲供应商A 供应商B生成 明细A：供应商A应收-
                case AccountsVerifySheetType.yinFuZhuanYinFu: {
                    if (!accountsVerifySheet.buyid || !accountsVerifySheet.buyid_b) {
                        return Promise.reject(new Error('[4]应收转应收,缺少供应商Id_A或者缺少供应商Id_B'));
                    }

                    //本次转移应收账款
                    let accountsPayableThisTransfer: number = 0;

                    for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                        const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                        if (accountsVerifySheetMx.correlationType === AccountCategory.accountsPayable) {
                            accountsPayableThisTransfer = accountsPayableThisTransfer + accountsVerifySheetMx.amountsThisVerify;
                            await this.accountsPayableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsThisVerify);
                            await this.accountsPayableMxService.create({
                                abstract: "",
                                reMark: "",
                                accountsPayableMxId: 0,
                                accountsPayableId: accountsVerifySheetMx.correlationId,
                                accountPayable: accountsVerifySheetMx.amountsThisVerify * -1,
                                actuallyPayment: 0,
                                advancesPayment: 0,
                                correlationId: accountsVerifySheet.accountsVerifySheetId,
                                correlationType: CodeType.HXD,
                                inDate: accountsVerifySheet.inDate,
                                creater: userName,
                                createdAt: new Date(),
                                updatedAt: null,
                                updater: ""
                            })
                        }
                    }

                    const createAccountsPayableThisTransferResult = await this.accountsPayableService.create({
                        accountsPayableId: 0,
                        accountsPayableType: AccountCategory.accountsPayable,
                        buyid: accountsVerifySheet.buyid_b,
                        amounts: accountsPayableThisTransfer,
                        checkedAmounts: 0,
                        notCheckAmounts: accountsPayableThisTransfer,
                        correlationId: accountsVerifySheet.accountsVerifySheetId,
                        correlationType: CodeType.HXD,
                        inDate: accountsVerifySheet.inDate,
                        creater: userName,
                        createdAt: new Date(),
                        updater: "",
                        updatedAt: null,
                        del_uuid: 0,
                        deletedAt: null,
                        deleter: ""
                    })

                    await this.accountsPayableMxService.create({
                        abstract: "",
                        reMark: "",
                        accountsPayableId: createAccountsPayableThisTransferResult.insertId,
                        accountsPayableMxId: 0,
                        accountPayable: accountsPayableThisTransfer,
                        actuallyPayment: 0,
                        advancesPayment: 0,
                        correlationId: accountsVerifySheet.accountsVerifySheetId,
                        correlationType: CodeType.HXD,
                        inDate: accountsVerifySheet.inDate,
                        creater: userName,
                        createdAt: new Date(),
                        updater: "",
                        updatedAt: null,
                    })
                }
                    break;
            }


            await this.accountsVerifySheetEntity.level1Review(accountsVerifySheetId, userName);
        })
    }

    public async unLevel1Review(accountsVerifySheetId: number, userName: string) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            //是否审核
            const accountsVerifySheet = await this.findById(accountsVerifySheetId);
            if (accountsVerifySheet.level1Review !== 1 && accountsVerifySheet.level2Review !== 0) {
                return Promise.reject(new Error('撤审失败,单据未审核'));
            }

            console.log('已审核，可以撤审');

            //获取明细
            const accountsVerifySheetMxList = await this.accountsVerifySheetMxService.find({
                accountsVerifySheetId: accountsVerifySheetId, accountsVerifySheetMxId: 0
            })

            console.log('获取明细撤审核销单明细');

            //循环处理核销单明细
            for (let i = 0; i < accountsVerifySheetMxList.length; i++) {
                const accountsVerifySheetMx = accountsVerifySheetMxList[i];
                const thisCancelWriteOffAmount = AccountsVerifySheetService.countThisCancelWriteOffAmount(accountsVerifySheetMx);
                //账款类型
                switch (accountsVerifySheetMx.correlationType) {
                    //[1]应收账款
                    case 1:
                        //减少已核销金额
                        await this.accountsReceivableService.reduceWriteOffAmount(accountsVerifySheetMx.correlationId, thisCancelWriteOffAmount);
                        //删除本次核销单相关应付账款明细
                        await this.accountsReceivableMxService.deleteByCorrelation(accountsVerifySheet.accountsVerifySheetId, CodeType.HXD);
                        break
                    // [2]预收账款
                    case 2:
                        //减少已核销金额
                        await this.accountsReceivableService.reduceWriteOffAmount(accountsVerifySheetMx.correlationId, thisCancelWriteOffAmount);
                        //删除本次核销单相关应付账款明细
                        await this.accountsReceivableMxService.deleteByCorrelation(accountsVerifySheet.accountsVerifySheetId, CodeType.HXD);
                        break
                    // [3]其他应收
                    case 3:
                        //减少已核销金额
                        await this.accountsReceivableService.reduceWriteOffAmount(accountsVerifySheetMx.correlationId, thisCancelWriteOffAmount);
                        //删除本次核销单相关应付账款明细
                        await this.accountsReceivableMxService.deleteByCorrelation(accountsVerifySheet.accountsVerifySheetId, CodeType.HXD);
                        break
                    //[4]应付账款
                    case 4:
                        //减少已核销金额
                        await this.accountsPayableService.reduceWriteOffAmount(accountsVerifySheetMx.correlationId, thisCancelWriteOffAmount);
                        //删除本次核销单相关应收账款明细
                        await this.accountsPayableMxService.deleteByCorrelationId(accountsVerifySheet.accountsVerifySheetId, CodeType.HXD);
                        break
                    //[5]预付账款
                    case 5:
                        //减少已核销金额
                        await this.accountsPayableService.reduceWriteOffAmount(accountsVerifySheetMx.correlationId, thisCancelWriteOffAmount);
                        //删除本次核销单相关应收账款明细
                        await this.accountsPayableMxService.deleteByCorrelationId(accountsVerifySheet.accountsVerifySheetId, CodeType.HXD);
                        break
                    //[6]其他应收
                    case 6:
                        //减少已核销金额
                        await this.accountsPayableService.reduceWriteOffAmount(accountsVerifySheetMx.correlationId, thisCancelWriteOffAmount);
                        //删除本次核销单相关应收账款明细
                        await this.accountsPayableMxService.deleteByCorrelationId(accountsVerifySheet.accountsVerifySheetId, CodeType.HXD);
                        break
                    default:
                        break;
                }
            }

            console.log('撤审循环处理核销单明细成功');

            //处理单头 [4]应收转应收 [5]应付转应付
            switch (accountsVerifySheet.sheetType) {
                //[4]应收转应收 冲客户A 生成客户B
                case 4:
                    //查询核销单 转移应收 生成的 客户B应收
                    const accountsReceivableList = await this.accountsReceivableService.find({
                        accountsReceivableId: 0,
                        accountsReceivableType: AccountCategory.accountsReceivable,
                        clientid: accountsVerifySheet.clientid_b,
                        correlationId: accountsVerifySheet.accountsVerifySheetId,
                        correlationType: CodeType.HXD,//[20]核销单
                        startDate: "",
                        endDate: "",
                        page: 0,
                        pagesize: 0
                    });

                    //删除客户B应收
                    for (let i = 0; i < accountsReceivableList.length; i++) {
                        const accountsReceivable = accountsReceivableList[i];
                        await this.accountsReceivableService.delete_data(accountsReceivable.accountsReceivableId, userName);
                    }
                    break;
                //[5]应付转应付 冲供应商A 供应商B生成
                case 5:
                    //查询核销单 转移应付 生成的 供应商B应付
                    const accountsPayableList = await this.accountsPayableService.find({
                        accountsPayableId: 0,
                        accountsPayableType: AccountCategory.accountsPayable,
                        buyid: accountsVerifySheet.buyid_b,
                        correlationId: accountsVerifySheet.accountsVerifySheetId,
                        correlationType: CodeType.HXD,//[20]核销单
                        startDate: "",
                        endDate: "",
                        page: 0,
                        pagesize: 0
                    });

                    //循环，删除生成的供应商B应付账款
                    for (let i = 0; i < accountsPayableList.length; i++) {
                        const accountsPayable = accountsPayableList[i];
                        await this.accountsPayableService.delete_data(accountsPayable.accountsPayableId, userName);
                    }
                    break;
                default:
                    break;
            }

            console.log('撤审处理单头成功');

            //更新单据审核状态
            await this.accountsVerifySheetEntity.unLevel1Review(accountsVerifySheetId);
            console.log('撤审更新单据审核状态成功');
        })

    }

    //计算本次取消核销金额
    private static countThisCancelWriteOffAmount(accountsVerifySheetMx: IAccountsVerifySheetMx) {
        //amountsMantissa + amountsMantissa
        return Number(
            round(
                chain(bignumber(accountsVerifySheetMx.amountsMantissa))
                    .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                    .done()
                , 4)
        )
    }
}