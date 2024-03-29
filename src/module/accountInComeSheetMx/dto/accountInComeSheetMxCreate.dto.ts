import {IAccountInComeSheetMx} from "../accountInComeSheetMx";
import {IsInt, IsNumber} from "class-validator";

export class AccountInComeSheetMxCreateDto implements IAccountInComeSheetMx {
    //收款单单据明细Id
    @IsInt()
    accountInComeSheetMxId: number;
    //收款单Id
    @IsInt()
    accountInComeId: number;
    //明细顺序
    @IsInt()
    printId: number;
    //单据金额
    @IsNumber()
    amounts: number;
    //已核销金额
    @IsNumber()
    amountsVerified: number;
    //未核销金额
    @IsNumber()
    amountsNotVerify: number;
    //冲尾数金额
    @IsNumber()
    amountsMantissa: number;
    //本次核销金额
    @IsNumber()
    amountsThisVerify: number;
    //相关单据Id
    @IsInt()
    correlationId: number;
    //相关单据类型
    @IsInt()
    correlationType: number


    constructor(accountInComeSheetMx: IAccountInComeSheetMx) {
        this.accountInComeSheetMxId = accountInComeSheetMx.accountInComeSheetMxId;
        this.accountInComeId = accountInComeSheetMx.accountInComeId;
        this.printId = accountInComeSheetMx.printId;
        this.amounts = accountInComeSheetMx.amounts;
        this.amountsVerified = accountInComeSheetMx.amountsVerified;
        this.amountsNotVerify = accountInComeSheetMx.amountsNotVerify;
        this.amountsMantissa = accountInComeSheetMx.amountsMantissa;
        this.amountsThisVerify = accountInComeSheetMx.amountsThisVerify;
        this.correlationId = accountInComeSheetMx.correlationId;
        this.correlationType = accountInComeSheetMx.correlationType;
    }
}