import {Injectable} from "@nestjs/common";
import {AccountInComeEntity} from "./accountInCome.entity";
import {AccountInComeFindDto} from "./dto/accountInComeFind.dto";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {AccountInComeAmountMxService} from "../accountInComeAmountMx/accountInComeAmountMx.service";
import {AccountRecordService} from "../accountsRecord/accountRecord.service";
import {verifyParam} from "../../utils/verifyParam";
import {AccountInComeAmountMxCreateDto} from "../accountInComeAmountMx/dto/accountInComeAmountMxCreate.dto";
import {AccountInComeSheetMxCreateDto} from "../accountInComeSheetMx/dto/accountInComeSheetMxCreate.dto";
import {AccountInComeCreateDto} from "./dto/accountInComeCreate.dto";
import {AccountInComeUpdateDto} from "./dto/accountInComeUpdate.dto";
import * as mathjs from 'mathjs';
import {IAccountsReceivable} from "../accountsReceivable/accountsReceivable";
import {CodeType} from "../autoCode/codeType";
import {IAccountRecord} from "../accountsRecord/accountRecord";
import {AccountCategoryType} from "../accountsVerifySheetMx/accountCategoryType";
import {IAccountInComeAmountMx} from "../accountInComeAmountMx/accountInComeAmountMx";
import {IAccountInCome} from "./accountInCome";
import {AccountInComeSheetMxService} from "../accountInComeSheetMx/accountInComeSheetMx.service";
import {IAccountInComeSheetMx} from "../accountInComeSheetMx/accountInComeSheetMx";
import {AccountsReceivableService} from "../accountsReceivable/accountsReceivable.service";
import {IAccountsReceivableSubjectMx} from "../accountsReceivableSubjectMx/accountsReceivableSubjectMx";

@Injectable()
export class AccountInComeService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly accountInComeEntity: AccountInComeEntity,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly accountInComeAmountMxService: AccountInComeAmountMxService,
        private readonly accountInComeSheetMxService: AccountInComeSheetMxService,
        private readonly accountRecordService: AccountRecordService,
        private readonly accountsReceivableService: AccountsReceivableService
    ) {
    }

    private static getAccountRecordList(accountInCome: IAccountInCome, accountInComeAmountMxList: IAccountInComeAmountMx[]) {
        const accountRecordList: IAccountRecord[] = [];
        for (let i = 0; i < accountInComeAmountMxList.length; i++) {
            const accountInComeAmountMx = accountInComeAmountMxList[i];
            //创建出纳记录
            const accountRecord: IAccountRecord = {
                accountRecordId: 0,
                accountId: accountInComeAmountMx.accountId,
                correlationId: accountInCome.accountInComeId,
                correlationType: CodeType.accountInCome,
                creater: accountInCome.level1Name,
                createdAt: new Date(),
                openQty: 0,
                debitQty: accountInComeAmountMx.amount,
                creditQty: 0,
                balanceQty: 0,
                indate: accountInCome.indate,
                reMark: "",
                relatedNumber: ""
            }
            accountRecordList.push(accountRecord);
        }
        return accountRecordList;
    }

    //收入单明细添加id
    private static accountInComeMxAddId(accountInComeCreateDto: AccountInComeCreateDto, accountInComeId: number) {
        //收入单 出纳账户收款明细
        const accountInComeAmountMxList = accountInComeCreateDto.accountInComeAmountMx;

        //验证出纳账户收款明细
        for (let i = 0; i < accountInComeAmountMxList.length; i++) {
            accountInComeAmountMxList[i].accountInComeId = accountInComeId
        }

        //出纳收入单 核销的明细
        const accountInComeSheetMx = accountInComeCreateDto.accountInComeSheetMx;

        //验证核销明细
        for (let i = 0; i < accountInComeSheetMx.length; i++) {
            accountInComeSheetMx[i].accountInComeId = accountInComeId
        }

        return accountInComeCreateDto
    }

    //验证明细参数
    private static async validateDetailParameters(accountInComeCreateDto: AccountInComeCreateDto) {

        if (accountInComeCreateDto.clientid === 0) {
            return Promise.reject(new Error('客户不能为空'));
        }

        //收入单 出纳账户收款明细
        const accountInComeAmountMxList = accountInComeCreateDto.accountInComeAmountMx;

        if (accountInComeAmountMxList.length === 0) {
            return Promise.reject(new Error('付款明细为空'));
        }

        //验证出纳账户收款明细
        for (let i = 0; i < accountInComeAmountMxList.length; i++) {
            await verifyParam(new AccountInComeAmountMxCreateDto(accountInComeAmountMxList[i]));
        }

        //出纳收入单 核销的明细
        const accountInComeSheetMx = accountInComeCreateDto.accountInComeSheetMx;

        if (accountInComeSheetMx.length > 0) {
            //验证核销明细
            for (let i = 0; i < accountInComeSheetMx.length; i++) {
                await verifyParam(new AccountInComeSheetMxCreateDto(accountInComeSheetMx[i]));
            }
        }
    }

    //核销合计是否等于收款金额
    private static async isEqual_writeOffAmount_accountAmount(accountInComeAmountMx: IAccountInComeAmountMx[], accountInComeSheetMx: IAccountInComeSheetMx[]) {
        let sumAccountsReceivable: number = 0;
        let sumAmountsThisVerify: number = 0;


        for (let i = 0; i < accountInComeAmountMx.length; i++) {
            sumAccountsReceivable = Number(
                mathjs.round(
                    mathjs.chain(
                        mathjs.bignumber(sumAccountsReceivable)
                    ).add(
                        mathjs.bignumber(accountInComeAmountMx[i].accountsReceivable)
                    ).done(), 4
                )
            )
        }

        for (let i = 0; i < accountInComeSheetMx.length; i++) {
            sumAmountsThisVerify = Number(
                mathjs.round(
                    mathjs.chain(
                        mathjs.bignumber(sumAmountsThisVerify)
                    ).add(
                        mathjs.bignumber(accountInComeSheetMx[i].amountsThisVerify)
                    ).done(), 4
                )
            )
        }

        //本次核销合计大于收款金额
        if (mathjs.equal(mathjs.bignumber(sumAmountsThisVerify), mathjs.bignumber(sumAccountsReceivable))) {
            return Promise.resolve(true);
        } else {
            return Promise.reject(new Error('保存失败，本次收款单核销金额不等于收款金额'))
        }
    }

    public async find(accountInComeFindDto: AccountInComeFindDto) {
        return await this.accountInComeEntity.find(accountInComeFindDto);
    }

    public async findSheetState(accountInComeFindDto: AccountInComeFindDto) {
        const accountInComeList = await this.accountInComeEntity.find(accountInComeFindDto);
        let completeL1Review = 0;
        let undoneL1Review = 0;
        let undoneL2Review = 0;

        for (let i = 0; i < accountInComeList.length; i++) {
            const accountInCome = accountInComeList[i];
            if(accountInCome.level1Review === 0){
                undoneL1Review = undoneL1Review + 1
            }else if(accountInCome.level1Review === 1){
                completeL1Review = completeL1Review + 1
            }

            if(accountInCome.level1Review === 1 && accountInCome.level2Review === 0){
                undoneL2Review = undoneL2Review + 1
            }
        }

        return {
            completeL1Review,
            undoneL1Review,
            undoneL2Review,
        }
    }

    public async findById(accountInComeId: number) {
        return await this.accountInComeEntity.findById(accountInComeId);
    }

    public async create(accountInComeCreateDto: AccountInComeCreateDto): Promise<{ id: number; code: string }> {
        await AccountInComeService.validateDetailParameters(accountInComeCreateDto);
        if (accountInComeCreateDto.accountInComeSheetMx.length > 0) {
            await AccountInComeService.isEqual_writeOffAmount_accountAmount(accountInComeCreateDto.accountInComeAmountMx, accountInComeCreateDto.accountInComeSheetMx);
        }

        return this.mysqldbAls.sqlTransaction(async () => {

            //创建单号
            accountInComeCreateDto.accountInComeCode = await this.autoCodeMxService.getSheetAutoCode(CodeType.accountInCome);

            //创建单头
            const createResult = await this.accountInComeEntity.create(accountInComeCreateDto);

            //给明细增加Id
            accountInComeCreateDto = AccountInComeService.accountInComeMxAddId(accountInComeCreateDto, createResult.insertId);

            //创建明细
            await this.accountInComeAmountMxService.create(accountInComeCreateDto.accountInComeAmountMx);

            //只收款的情况下没有核销明细
            if (accountInComeCreateDto.accountInComeSheetMx.length > 0) {
                await this.accountInComeSheetMxService.create(accountInComeCreateDto.accountInComeSheetMx);
            }

            return {
                id: createResult.insertId,
                code: accountInComeCreateDto.accountInComeCode
            }
        })
    }

    public async create_l1Review(accountInComeCreateDto: AccountInComeCreateDto): Promise<{ id: number; code: string }> {
        return await this.mysqldbAls.sqlTransaction(async () => {
            const result = await this.create(accountInComeCreateDto);
            await this.level1Review(result.id, accountInComeCreateDto.creater)
            return result
        })
    }

    public async update(accountInComeUpdateDto: AccountInComeUpdateDto) {
        const accountInCome = await this.findById(accountInComeUpdateDto.accountInComeId);


        const accountInComeSheetMxList = await this.accountInComeSheetMxService.findById(accountInComeUpdateDto.accountInComeId);
        //验证单头状态是否可以出纳审核
        if (accountInCome.level1Review !== 0 && accountInCome.level2Review !== 0 && accountInCome.del_uuid !== 0) {
            return Promise.reject(new Error('审核失败,收款单状态不正确'));
        }

        await AccountInComeService.validateDetailParameters(accountInComeUpdateDto);

        if (accountInComeUpdateDto.accountInComeSheetMx.length > 0) {
            await AccountInComeService.isEqual_writeOffAmount_accountAmount(accountInComeUpdateDto.accountInComeAmountMx, accountInComeUpdateDto.accountInComeSheetMx);
        }

        return this.mysqldbAls.sqlTransaction(async () => {

            //更新单头
            await this.accountInComeEntity.update(accountInComeUpdateDto);

            //删除明细
            await this.accountInComeAmountMxService.deleteById(accountInComeUpdateDto.accountInComeId);
            //更新前如果有核销明细要删除
            if (accountInComeSheetMxList.length > 0) {
                await this.accountInComeSheetMxService.deleteById(accountInComeUpdateDto.accountInComeId);
            }

            //给明细增加Id
            accountInComeUpdateDto = AccountInComeService.accountInComeMxAddId(accountInComeUpdateDto, accountInComeUpdateDto.accountInComeId);

            //创建明细
            await this.accountInComeAmountMxService.create(accountInComeUpdateDto.accountInComeAmountMx);
            //只收款的情况下没有核销明细
            if (accountInComeUpdateDto.accountInComeSheetMx.length > 0) {
                await this.accountInComeSheetMxService.create(accountInComeUpdateDto.accountInComeSheetMx);
            }
        })
    }

    public async update_l1Review(accountInComeUpdateDto: AccountInComeUpdateDto){
        return await this.mysqldbAls.sqlTransaction(async ()=>{
            await this.update(accountInComeUpdateDto);
            return await this.level1Review(accountInComeUpdateDto.accountInComeId,accountInComeUpdateDto.updater);
        })
    }

    public async deleteById(accountInComeId: number, userName: string) {
        const accountInCome = await this.findById(accountInComeId);

        //验证单头状态是否可以出纳审核
        if (accountInCome.level1Review !== 0 && accountInCome.level2Review !== 0 && accountInCome.del_uuid !== 0) {
            return Promise.reject(new Error('审核失败,收款单状态不正确'));
        }

        return await this.accountInComeEntity.deleteById(accountInComeId, userName);
    }

    public async level1Review(accountInComeId: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const accountInCome = await this.findById(accountInComeId);
            const accountInComeAmountMxList = await this.accountInComeAmountMxService.findById(accountInComeId);
            const accountInComeSheetMxList = await this.accountInComeSheetMxService.findById(accountInComeId);

            //验证单头状态是否可以出纳审核
            if (accountInCome.level1Review !== 0 && accountInCome.level2Review !== 0 && accountInCome.del_uuid !== 0) {
                return Promise.reject(new Error('审核失败,收款单状态不正确'));
            }

            accountInCome.level1Review = 1;
            accountInCome.level1Name = userName;
            accountInCome.level1Date = new Date();

            await this.accountInComeEntity.level1Review(accountInComeId, userName);

            //创建出纳记录数组
            const accountRecordList: IAccountRecord[] = AccountInComeService.getAccountRecordList(accountInCome, accountInComeAmountMxList);

            if (accountInComeSheetMxList.length === 0) {
                //创建出纳记录
                for (let i = 0; i < accountRecordList.length; i++) {
                    await this.accountRecordService.create(accountRecordList[i]);
                    await this.accountRecordService.countAccountQty(accountRecordList[i].accountId);
                }
                //创建预收款数组
                await this.createAccountsReceivable(accountInCome, accountInComeAmountMxList);
            } else {
                //创建出纳记录
                for (let i = 0; i < accountRecordList.length; i++) {
                    await this.accountRecordService.create(accountRecordList[i]);
                    await this.accountRecordService.countAccountQty(accountRecordList[i].accountId);
                }
                for (let i = 0; i < accountInComeSheetMxList.length; i++) {
                    const accountInComeSheetMx = accountInComeSheetMxList[i];
                    const accountsReceivableSubjectMx: IAccountsReceivableSubjectMx = {
                        accountsReceivableSubjectMxId: 0,
                        accountsReceivableId: accountInComeSheetMx.correlationId,
                        inDate: accountInCome.indate,
                        correlationId: accountInCome.accountInComeId,
                        correlationType: CodeType.accountInCome,
                        debit: 0,
                        credit: accountInComeSheetMx.amountsThisVerify,
                        creater: accountInCome.creater,
                        createdAt: accountInCome.createdAt,
                        abstract: "",
                        reMark: "",
                    }
                    await this.accountsReceivableService.createAccountsReceivableSubject(accountsReceivableSubjectMx);

                    if (accountInComeSheetMx.amountsMantissa > 0) {
                        const accountsReceivableSubjectMx: IAccountsReceivableSubjectMx = {
                            accountsReceivableSubjectMxId: 0,
                            accountsReceivableId: accountInComeSheetMx.correlationId,
                            inDate: accountInCome.indate,
                            correlationId: accountInCome.accountInComeId,
                            correlationType: CodeType.accountInCome,
                            debit: -accountInComeSheetMx.amountsMantissa,
                            credit: 0,
                            creater: accountInCome.creater,
                            createdAt: accountInCome.createdAt,
                            abstract: `冲尾数`,
                            reMark: "",
                        }
                        await this.accountsReceivableService.createAccountsReceivableSubject(accountsReceivableSubjectMx);
                    }
                }
            }


        })
    }

    public async unLevel1Review(accountInComeId: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const accountInCome = await this.findById(accountInComeId);
            const accountInComeSheetMxList = await this.accountInComeSheetMxService.findById(accountInComeId);
            if (accountInCome.level1Review !== 1 || accountInCome.level2Review !== 0 || accountInCome.del_uuid !== 0) {
                return Promise.reject(new Error("审核失败,单据状态不正确"));
            }
            await this.accountInComeEntity.unLevel1Review(accountInComeId);

            //删除出纳记录
            await this.accountRecordService.deleteByCorrelation(accountInCome.accountInComeId, CodeType.accountInCome);

            if (accountInComeSheetMxList.length > 0) {
                //删除收款单相关的 账款明细记录
                //查询 明细记录计算得出已核销未核销
                await this.accountsReceivableService.deleteMxByCorrelation(accountInCome.accountInComeId, CodeType.accountInCome);
            }

            //删除此单生成的应收账款
            await this.accountsReceivableService.deleteByCorrelation(accountInCome.accountInComeId, CodeType.accountInCome);
        })
    }

    private async createAccountsReceivable(accountInCome: IAccountInCome, accountInComeAmountMxList: IAccountInComeAmountMx[]) {
        let amounts: number = 0;
        for (let i = 0; i < accountInComeAmountMxList.length; i++) {
            const accountInComeAmountMx = accountInComeAmountMxList[i];

            //计算收款产生多少应收账款
            amounts = Number(mathjs.round(
                mathjs.chain(
                    mathjs.bignumber(amounts)
                ).add(
                    mathjs.bignumber(accountInComeAmountMx.accountsReceivable)
                ).done(
                ), 4));
        }

        //创建预收账款
        const accountsReceivable: IAccountsReceivable = {
            accountsReceivableId: 0,
            accountsReceivableType: AccountCategoryType.advancePayment2,
            inDate: accountInCome.indate,
            clientid: accountInCome.clientid,

            correlationId: accountInCome.accountInComeId,
            correlationType: CodeType.accountInCome,

            amounts: amounts,
            checkedAmounts: 0,
            notCheckAmounts: amounts,

            creater: accountInCome.level1Name,
            createdAt: accountInCome.level1Date,
            updater: "",
            updatedAt: null,
            del_uuid: 0,
            deletedAt: null,
            deleter: "",
        }
        await this.accountsReceivableService.createAccountsReceivable(accountsReceivable);

    }
}