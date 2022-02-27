import {IAccountsVerifySheetMx} from "../../accountsVerifySheetMx/accountsVerifySheetMx";
import {IsInt, IsNumber} from "class-validator";

export class AccountsVerifySheetMxUpdateDto implements IAccountsVerifySheetMx {
    //账款核销明细Id
    @IsInt()
    accountsVerifySheetMxId: number;
    //账款核销Id
    @IsInt()
    accountsVerifySheetId: number;
    //单据金额 10  单据金额>=已核销金额+冲尾数金额+本次核销金额  未核销金额>=冲尾数金额+本次核销金额
    @IsNumber()
    amounts: number;
    //已核销金额 5
    @IsNumber()
    amountsVerified: number;
    //未核销金额 5
    @IsNumber()
    amountsNotVerify: number;
    //冲尾数金额 1
    @IsNumber()
    amountsMantissa: number;
    //本次核销金额 4
    @IsNumber()
    amountsThisVerify: number;
    //账款Id
    @IsInt()
    correlationId: number;
    //账款类别
    @IsInt()
    correlationType: number;
    @IsInt()
    printId: number;


    constructor(accountsVerifySheetMx:IAccountsVerifySheetMx) {
        this.accountsVerifySheetMxId = accountsVerifySheetMx.accountsVerifySheetMxId;
        this.accountsVerifySheetId = accountsVerifySheetMx.accountsVerifySheetId;
        this.amounts = accountsVerifySheetMx.amounts;
        this.amountsVerified = accountsVerifySheetMx.amountsVerified;
        this.amountsNotVerify = accountsVerifySheetMx.amountsNotVerify;
        this.amountsMantissa = accountsVerifySheetMx.amountsMantissa;
        this.amountsThisVerify = accountsVerifySheetMx.amountsThisVerify;
        this.correlationId = accountsVerifySheetMx.correlationId;
        this.correlationType = accountsVerifySheetMx.correlationType;
        this.printId = accountsVerifySheetMx.printId;
    }
}