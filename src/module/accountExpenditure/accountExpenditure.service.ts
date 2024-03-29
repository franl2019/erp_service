import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {AccountExpenditureEntity} from "./accountExpenditure.entity";
import {AccountExpenditureFindDto} from "./dto/accountExpenditureFind.dto";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {AccountRecordService} from "../accountsRecord/accountRecord.service";
import {CodeType} from "../autoCode/codeType";
import {AccountExpenditureAmountMxService} from "../accountExpenditureAmountMx/accountExpenditureAmountMx.service";
import {AccountExpenditureSheetMxService} from "../accountExpenditureSheetMx/accountExpenditureSheetMx.service";
import {AccountExpenditureCreateDto} from "./dto/accountExpenditureCreate.dto";
import {IAccountExpenditureAmountMx} from "../accountExpenditureAmountMx/accountExpenditureAmountMx";
import {IAccountExpenditureSheetMx} from "../accountExpenditureSheetMx/accountExpenditureSheetMx";
import {useVerifyParam} from "../../utils/verifyParam/useVerifyParam";
import {
    AccountExpenditureAmountMxCreateDto
} from "../accountExpenditureAmountMx/dto/accountExpenditureAmountMxCreate.dto";
import {AccountExpenditureSheetMxCreateDto} from "../accountExpenditureSheetMx/dto/accountExpenditureSheetMxCreate.dto";
import {AccountExpenditureUpdateDto} from "./dto/accountExpenditureUpdate.dto";
import {IAccountRecord} from "../accountsRecord/accountRecord";
import {IAccountExpenditure} from "./accountExpenditure";
import * as mathjs from "mathjs";
import {AccountsPayableService} from "../accountsPayable/accountsPayable.service";
import {AccountCategoryType} from "../accountsVerifySheetMx/accountCategoryType";

@Injectable()
export class AccountExpenditureService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly accountRecordService: AccountRecordService,
        private readonly accountsPayableService: AccountsPayableService,
        private readonly accountExpenditureEntity: AccountExpenditureEntity,
        private readonly accountExpenditureAmountMxService: AccountExpenditureAmountMxService,
        private readonly accountExpenditureSheetMxService: AccountExpenditureSheetMxService,
    ) {
    }

    //收款明细添加Id
    private static async addIdForAmountMxList(accountExpenditureAmountMxList: IAccountExpenditureAmountMx[], accountExpenditureId: number) {
        for (let i = 0; i < accountExpenditureAmountMxList.length; i++) {
            const accountExpenditureAmountMx = accountExpenditureAmountMxList[i];
            accountExpenditureAmountMx.accountExpenditureId = accountExpenditureId;
        }
        return accountExpenditureAmountMxList
    }

    //核销明细添加单头Id
    private static async addIdForSheetMxList(accountExpenditureSheetMxList: IAccountExpenditureSheetMx[], accountExpenditureId: number) {
        for (let i = 0; i < accountExpenditureSheetMxList.length; i++) {
            const accountExpenditureSheetMx = accountExpenditureSheetMxList[i];
            accountExpenditureSheetMx.accountExpenditureId = accountExpenditureId;
        }
        return accountExpenditureSheetMxList
    }

    //验证参数核销明细参数
    private static async validationParameters(accountExpenditureCreateDto: AccountExpenditureCreateDto) {
        const accountExpenditureAmountMxList = accountExpenditureCreateDto.accountExpenditureAmountMx;
        const accountExpenditureSheetMxList = accountExpenditureCreateDto.accountExpenditureSheetMx;

        for (let i = 0; i < accountExpenditureAmountMxList.length; i++) {
            const createDto = new AccountExpenditureAmountMxCreateDto(accountExpenditureAmountMxList[i]);
            await useVerifyParam(createDto);
        }

        for (let i = 0; i < accountExpenditureSheetMxList.length; i++) {
            const createDto = new AccountExpenditureSheetMxCreateDto(accountExpenditureSheetMxList[i]);
            await useVerifyParam(createDto);
        }

    }

    //创建出纳付款记录
    private static createAccountRecord(accountExpenditure: IAccountExpenditure, accountExpenditureAmountMx: IAccountExpenditureAmountMx[]) {
        const accountRecordList: IAccountRecord[] = []
        const accountExpenditureAmountMxList = accountExpenditureAmountMx;
        for (let i = 0; i < accountExpenditureAmountMxList.length; i++) {
            const accountExpenditureAmountMx = accountExpenditureAmountMxList[i]
            //创建出纳记录
            const accountRecord: IAccountRecord = {
                accountRecordId: 0,
                accountId: accountExpenditureAmountMx.accountId,
                correlationId: accountExpenditureAmountMx.accountExpenditureId,
                correlationType: CodeType.accountExpenditure,
                creater: accountExpenditure.level1Name,
                createdAt: new Date(),
                openQty: 0,
                debitQty: 0,
                creditQty: accountExpenditureAmountMx.amount,
                balanceQty: 0,
                indate: accountExpenditure.indate,
                reMark: "",
                relatedNumber: ""
            }
            accountRecordList.push(accountRecord);
        }
        return accountRecordList;
    }

    //核销合计是否等于付款金额
    private static async isEqual_writeOffAmount_accountAmount(accountExpenditureAmountMx: IAccountExpenditureAmountMx[], accountExpenditureSheetMxList: IAccountExpenditureSheetMx[]) {
        let sumAccountsPayable: number = 0;
        let sumAmountsThisVerify: number = 0;


        for (let i = 0; i < accountExpenditureAmountMx.length; i++) {
            sumAccountsPayable = Number(
                mathjs.round(
                    mathjs.chain(
                        mathjs.bignumber(sumAccountsPayable)
                    ).add(
                        mathjs.bignumber(accountExpenditureAmountMx[i].amount)
                    ).done(), 4
                )
            )
        }

        for (let i = 0; i < accountExpenditureSheetMxList.length; i++) {
            sumAmountsThisVerify = Number(
                mathjs.round(
                    mathjs.chain(
                        mathjs.bignumber(sumAmountsThisVerify)
                    ).add(
                        mathjs.bignumber(accountExpenditureSheetMxList[i].amountsThisVerify)
                    ).done(), 4
                )
            )
        }

        //本次核销合计大于收款金额
        if (mathjs.equal(mathjs.bignumber(sumAmountsThisVerify), mathjs.bignumber(sumAccountsPayable))) {
            return Promise.resolve(true);
        } else {
            return Promise.reject(new Error('保存失败，本次付款单核销金额不等于付款金额'))
        }
    }

    public async findById(accountExpenditureId: number) {
        return await this.accountExpenditureEntity.findById(accountExpenditureId);
    }

    public async find(accountExpenditureFindDto: AccountExpenditureFindDto) {
        return await this.accountExpenditureEntity.find(accountExpenditureFindDto);
    }

    public async findAccountExpenditureState(accountExpenditureFindDto: AccountExpenditureFindDto){
        const accountExpenditures = await this.accountExpenditureEntity.find(accountExpenditureFindDto);
        let completeL1Review = 0;
        let undoneL1Review = 0;
        let undoneL2Review = 0;
        for (let i = 0; i < accountExpenditures.length; i++) {
            const accountExpenditure = accountExpenditures[i];
            if(accountExpenditure.level1Review === 0){
                undoneL1Review = undoneL1Review + 1
            }else if(accountExpenditure.level1Review === 1){
                completeL1Review = completeL1Review + 1
            }

            if(accountExpenditure.level1Review === 1 && accountExpenditure.level2Review === 0){
                undoneL2Review = undoneL2Review + 1
            }
        }

        return {
            completeL1Review,
            undoneL1Review,
            undoneL2Review,
        }
    }

    public async create(accountExpenditureCreateDto: AccountExpenditureCreateDto):Promise<{id:number;code:string}> {
        if (accountExpenditureCreateDto.buyid === 0) {
            return Promise.reject(new Error("请选择供应商"));
        }

        if (accountExpenditureCreateDto.amount === 0 || accountExpenditureCreateDto.accountExpenditureAmountMx.length === 0) {
            return Promise.reject(new Error("缺少付款明细"));
        }

        return this.mysqldbAls.sqlTransaction(async () => {
            //验证参数
            await AccountExpenditureService.validationParameters(accountExpenditureCreateDto);
            //如果有核销明细,检查付款是否和核销金额一致
            if (accountExpenditureCreateDto.accountExpenditureSheetMx.length > 0) {
                await AccountExpenditureService.isEqual_writeOffAmount_accountAmount(accountExpenditureCreateDto.accountExpenditureAmountMx, accountExpenditureCreateDto.accountExpenditureSheetMx);
            }
            //创建单号
            accountExpenditureCreateDto.accountExpenditureCode = await this.autoCodeMxService.getSheetAutoCode(CodeType.accountExpenditure);
            //创建单头
            const result = await this.accountExpenditureEntity.create(accountExpenditureCreateDto);
            //明细添加单头Id
            const accountExpenditureAmountMxList = await AccountExpenditureService.addIdForAmountMxList(accountExpenditureCreateDto.accountExpenditureAmountMx, result.insertId);
            //创建明细
            await this.accountExpenditureAmountMxService.create(accountExpenditureAmountMxList);

            if (accountExpenditureCreateDto.accountExpenditureSheetMx.length > 0) {
                const accountExpenditureSheetMxList = await AccountExpenditureService.addIdForSheetMxList(accountExpenditureCreateDto.accountExpenditureSheetMx, result.insertId);
                await this.accountExpenditureSheetMxService.create(accountExpenditureSheetMxList);
            }

            return {
                id: result.insertId,
                code: accountExpenditureCreateDto.accountExpenditureCode
            }
        })
    }

    public async create_l1Review(accountExpenditureCreateDto: AccountExpenditureCreateDto) {
        return await this.mysqldbAls.sqlTransaction(async ()=>{
            const result = await this.create(accountExpenditureCreateDto);
            await this.level1Review(result.id,accountExpenditureCreateDto.creater);
            return result
        })
    }

    public async update(accountExpenditureUpdateDto: AccountExpenditureUpdateDto) {
        if (accountExpenditureUpdateDto.buyid === 0) {
            return Promise.reject(new Error("请选择供应商"));
        }

        if (accountExpenditureUpdateDto.amount === 0 || accountExpenditureUpdateDto.accountExpenditureAmountMx.length === 0) {
            return Promise.reject(new Error("缺少付款明细"));
        }

        return this.mysqldbAls.sqlTransaction(async () => {
            const accountExpenditure = await this.findById(accountExpenditureUpdateDto.accountExpenditureId);
            const accountExpenditureSheetMxList_db = await this.accountExpenditureSheetMxService.findById(accountExpenditureUpdateDto.accountExpenditureId)
            //状态是否可以更新
            if (accountExpenditure.level1Review !== 0 && accountExpenditure.level2Review !== 0) {
                return Promise.reject(new Error("更新失败，请先撤审此单据"));
            }
            //验证参数
            await AccountExpenditureService.validationParameters(accountExpenditureUpdateDto);

            //如果有核销明细,检查付款是否和核销金额一致
            if (accountExpenditureUpdateDto.accountExpenditureSheetMx.length > 0) {
                await AccountExpenditureService.isEqual_writeOffAmount_accountAmount(accountExpenditureUpdateDto.accountExpenditureAmountMx, accountExpenditureUpdateDto.accountExpenditureSheetMx);
            }

            //明细添加单头Id
            const accountExpenditureAmountMxList = await AccountExpenditureService.addIdForAmountMxList(accountExpenditureUpdateDto.accountExpenditureAmountMx, accountExpenditure.accountExpenditureId);
            const accountExpenditureSheetMxList = await AccountExpenditureService.addIdForSheetMxList(accountExpenditureUpdateDto.accountExpenditureSheetMx, accountExpenditure.accountExpenditureId);

            //更新单头
            await this.accountExpenditureEntity.update(accountExpenditureUpdateDto);

            //删除明细
            await this.accountExpenditureAmountMxService.deleteById(accountExpenditure.accountExpenditureId);
            //更新明细
            await this.accountExpenditureAmountMxService.create(accountExpenditureAmountMxList);

            if (accountExpenditureSheetMxList_db.length > 0) {
                await this.accountExpenditureSheetMxService.deleteById(accountExpenditure.accountExpenditureId);
                await this.accountExpenditureSheetMxService.create(accountExpenditureSheetMxList);
            }

        })
    }

    public async update_l1Review(accountExpenditureUpdateDto: AccountExpenditureUpdateDto){
        return await this.mysqldbAls.sqlTransaction(async ()=>{
            await this.update(accountExpenditureUpdateDto);
            return await this.level1Review(accountExpenditureUpdateDto.accountExpenditureId,accountExpenditureUpdateDto.updater);
        })
    }

    public async level1Review(accountExpenditureId: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const accountExpenditure = await this.findById(accountExpenditureId);
            accountExpenditure.level1Name = userName;
            accountExpenditure.level1Date = new Date();
            //状态是否可以更新
            if (accountExpenditure.level1Review !== 0 && accountExpenditure.level2Review !== 0) {
                return Promise.reject(new Error("审核失败，请先撤审此单据"));
            }
            const accountExpenditureAmountMxList = await this.accountExpenditureAmountMxService.findById(accountExpenditureId)
            const accountExpenditureSheetMxList = await this.accountExpenditureSheetMxService.findById(accountExpenditureId)

            if (accountExpenditureSheetMxList.length === 0) {
                //创建出纳记录
                const accountRecords = AccountExpenditureService.createAccountRecord(accountExpenditure, accountExpenditureAmountMxList);
                for (let i = 0; i < accountRecords.length; i++) {
                    const accountRecord = accountRecords[i];
                    await this.accountRecordService.create(accountRecord);
                    await this.accountRecordService.countAccountQty(accountRecord.accountId);
                    await this.accountsPayableService.createAccountPayable({
                        accountsPayableId: 0,
                        accountsPayableType: AccountCategoryType.prepayments5,
                        correlationId: accountExpenditure.accountExpenditureId,
                        correlationType: CodeType.accountExpenditure,
                        amounts: accountRecord.creditQty,
                        buyid: accountExpenditure.buyid,
                        checkedAmounts: 0,
                        inDate: accountExpenditure.indate,
                        notCheckAmounts: accountRecord.creditQty,
                        creater: accountExpenditure.level1Name,
                        createdAt: new Date(),
                        updater: "",
                        updatedAt: null,
                        del_uuid: 0,
                        deletedAt: null,
                        deleter: ""
                    })
                }

            } else {
                //创建出纳记录
                const accountRecords = AccountExpenditureService.createAccountRecord(accountExpenditure, accountExpenditureAmountMxList);
                for (let i = 0; i < accountRecords.length; i++) {
                    const accountRecord = accountRecords[i];
                    await this.accountRecordService.create(accountRecord);
                    await this.accountRecordService.countAccountQty(accountRecord.accountId);
                }

                //核销明细
                for (let i = 0; i < accountExpenditureSheetMxList.length; i++) {
                    const accountExpenditureSheetMx = accountExpenditureSheetMxList[i];
                    //本次核销
                    await this.accountsPayableService.createAccountsPayableSubject({
                        accountsPayableSubjectMxId: 0,
                        accountsPayableId: accountExpenditureSheetMx.correlationId,
                        inDate: accountExpenditure.indate,
                        correlationId: accountExpenditure.accountExpenditureId,
                        correlationType: CodeType.accountExpenditure,
                        debit: accountExpenditureSheetMx.amountsThisVerify,
                        credit: 0,
                        creater: accountExpenditure.level1Name,
                        createdAt: accountExpenditure.level1Date,
                        abstract: "",
                        reMark: "",
                    })
                    //冲尾数
                    if (accountExpenditureSheetMx.amountsMantissa > 0) {
                        await this.accountsPayableService.createAccountsPayableSubject({
                            accountsPayableSubjectMxId: 0,
                            accountsPayableId: accountExpenditureSheetMx.correlationId,
                            inDate: accountExpenditure.indate,
                            correlationId: accountExpenditure.accountExpenditureId,
                            correlationType: CodeType.accountExpenditure,
                            debit: 0,
                            credit: -accountExpenditureSheetMx.amountsMantissa,
                            creater: accountExpenditure.level1Name,
                            createdAt: accountExpenditure.level1Date,
                            abstract: `冲尾数`,
                            reMark: "",
                        })
                    }
                }
            }

            await this.accountExpenditureEntity.level1Review(accountExpenditureId, userName);

        });
    }

    public async unLevel1Review(accountExpenditureId: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const accountExpenditure = await this.findById(accountExpenditureId);
            //状态是否可以更新
            if (accountExpenditure.level1Review !== 1 && accountExpenditure.level1Review + accountExpenditure.level2Review !== 0) {
                return Promise.reject(new Error("撤审失败，请先撤审此单据"));
            }

            //删除出纳记录
            await this.accountRecordService.deleteByCorrelation(accountExpenditureId, CodeType.accountExpenditure);
            //删除应付账款科目明细
            await this.accountsPayableService.deleteMxByCorrelation(accountExpenditureId, CodeType.accountExpenditure);
            //删除应付账款
            await this.accountsPayableService.deleteByCorrelation(accountExpenditureId, CodeType.accountExpenditure);
            await this.accountExpenditureEntity.unLevel1Review(accountExpenditureId);
        });
    }

    public async deleteById(accountExpenditureId: number) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            const accountExpenditure = await this.findById(accountExpenditureId);
            const accountExpenditureSheetMxList = await this.accountExpenditureSheetMxService.findById(accountExpenditureId)
            //状态是否可以更新
            if (accountExpenditure.level1Review !== 0 && accountExpenditure.level2Review !== 0 && accountExpenditure.del_uuid === 0) {
                return Promise.reject(new Error("撤审失败，请先撤审此单据"));
            }

            await this.accountExpenditureEntity.deleteById(accountExpenditureId);
            await this.accountExpenditureAmountMxService.deleteById(accountExpenditureId);


            if (accountExpenditureSheetMxList.length > 0) {
                await this.accountExpenditureSheetMxService.deleteById(accountExpenditureId);
            }
        })
    }
}