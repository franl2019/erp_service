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
import {AccountsVerifySheetMxType} from "../accountsVerifySheetMx/accountsVerifySheetMxType";

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
            createDto.accountsVerifySheetCode = await this.autoCodeMxService.getAutoCode(20);
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
            //单据类型
            /*
            * 核销单类型
            * [1]预收冲应收 客户A                明细A：预收  -    明细B：应收   -
            * [2]预付冲应付 供应商A              明细A：预付  -    明细B：应付   -
            * [3]应收冲应付 客户A   供应商A       明细A：客户A应收  - 明细B：客户A应收 -
            * [4]应收转应收 冲客户A   客户B生成    明细A：客户A应收  -
            * [5]应付转应付 冲供应商A 供应商B生成   明细A：供应商A应收 -
            * */
            switch (accountsVerifySheet.sheetType) {
                case AccountsVerifySheetType.yuShouChongYinShou:
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
                        if (accountsVerifySheetMx.correlationType === AccountsVerifySheetMxType.advancePayment) {
                            advancePaymentThisWriteOff = advancePaymentThisWriteOff + accountsVerifySheetMx.amountsThisVerify
                        }

                        //应收账款 本次核销相加
                        if (accountsVerifySheetMx.correlationType === AccountsVerifySheetMxType.accountsReceivable) {
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
                        if (accountsVerifySheetMx.correlationType === AccountsVerifySheetMxType.advancePayment) {
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
                                correlationType: 20,
                                createdAt: new Date(),
                                creater: "",
                                inDate: accountsVerifySheet.inDate,
                                reMark: "",
                                receivables: 0,
                                updatedAt: null,
                                updater: ""
                            })
                        }

                        //应收款
                        if (accountsVerifySheetMx.correlationType === AccountsVerifySheetMxType.advancePayment) {
                            //更新账款信息
                            //本次核销更新
                            await this.accountsReceivableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsThisVerify);
                            await this.accountsReceivableMxService.create({
                                abstract: "",
                                accountReceivableMxId: 0,
                                accountsReceivableId: accountsVerifySheetMx.correlationId,
                                actuallyReceived: accountsVerifySheetMx.amountsThisVerify,
                                advancesReceived: 0,
                                correlationId: accountsVerifySheet.accountsVerifySheetId,
                                correlationType: 20,
                                createdAt: new Date(),
                                creater: "",
                                inDate: accountsVerifySheet.inDate,
                                reMark: "",
                                receivables: 0,
                                updatedAt: null,
                                updater: ""
                            })
                            //本次冲尾数更新
                            await this.accountsReceivableService.increaseWriteOffAmount(accountsVerifySheetMx.correlationId, accountsVerifySheetMx.amountsMantissa);
                            await this.accountsReceivableMxService.create({
                                abstract: "",
                                accountReceivableMxId: 0,
                                accountsReceivableId: accountsVerifySheetMx.correlationId,
                                actuallyReceived: 0,
                                advancesReceived: 0,
                                correlationId: accountsVerifySheet.accountsVerifySheetId,
                                correlationType: 20,
                                createdAt: new Date(),
                                creater: "",
                                inDate: accountsVerifySheet.inDate,
                                reMark: "",
                                receivables: accountsVerifySheetMx.amountsMantissa,
                                updatedAt: null,
                                updater: ""
                            })
                        }
                    }
                    break;
                case AccountsVerifySheetType.yuFuChongYinFu:
                    break;
                case AccountsVerifySheetType.yinShouChongYinFu:
                    break;
                case AccountsVerifySheetType.yinShouZhuanYinShou:
                    break;
                case AccountsVerifySheetType.yinFuZhuanYinFu:
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
                        await this.accountsReceivableMxService.deleteByCorrelation(accountsVerifySheet.accountsVerifySheetId, 20);
                        break
                    // [2]预收账款
                    case 2:
                        //减少已核销金额
                        await this.accountsReceivableService.reduceWriteOffAmount(accountsVerifySheetMx.correlationId, thisCancelWriteOffAmount);
                        //删除本次核销单相关应付账款明细
                        await this.accountsReceivableMxService.deleteByCorrelation(accountsVerifySheet.accountsVerifySheetId, 20);
                        break
                    // [3]其他应收
                    case 3:
                        //减少已核销金额
                        await this.accountsReceivableService.reduceWriteOffAmount(accountsVerifySheetMx.correlationId, thisCancelWriteOffAmount);
                        //删除本次核销单相关应付账款明细
                        await this.accountsReceivableMxService.deleteByCorrelation(accountsVerifySheet.accountsVerifySheetId, 20);
                        break
                    //[4]应付账款
                    case 4:
                        //减少已核销金额
                        await this.accountsPayableService.reduceWriteOffAmount(accountsVerifySheetMx.correlationId, thisCancelWriteOffAmount);
                        //删除本次核销单相关应收账款明细
                        await this.accountsPayableMxService.deleteByCorrelationId(accountsVerifySheet.accountsVerifySheetId, 20);
                        break
                    //[5]预付账款
                    case 5:
                        //减少已核销金额
                        await this.accountsPayableService.reduceWriteOffAmount(accountsVerifySheetMx.correlationId, thisCancelWriteOffAmount);
                        //删除本次核销单相关应收账款明细
                        await this.accountsPayableMxService.deleteByCorrelationId(accountsVerifySheet.accountsVerifySheetId, 20);
                        break
                    //[6]其他应收
                    case 6:
                        //减少已核销金额
                        await this.accountsPayableService.reduceWriteOffAmount(accountsVerifySheetMx.correlationId, thisCancelWriteOffAmount);
                        //删除本次核销单相关应收账款明细
                        await this.accountsPayableMxService.deleteByCorrelationId(accountsVerifySheet.accountsVerifySheetId, 20);
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
                        clientid: accountsVerifySheet.clientid_b,
                        correlationId: accountsVerifySheet.accountsVerifySheetId,
                        correlationType: 20,//[20]核销单
                        startDate: "",
                        endDate: "",
                        page: 0,
                        pagesize: 0,
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
                        buyid: accountsVerifySheet.buyid_b,
                        correlationId: accountsVerifySheet.accountsVerifySheetId,
                        correlationType: 20,//[20]核销单
                        startDate: "",
                        endDate: "",
                        page: 0,
                        pagesize: 0,
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
        return Number(
            round(
                chain(bignumber(accountsVerifySheetMx.amountsMantissa))
                    .add(bignumber(accountsVerifySheetMx.amountsThisVerify))
                    .done()
                , 4)
        )
    }
}