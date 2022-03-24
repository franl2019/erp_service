import {IsInt, IsNumber, IsString} from "class-validator";
import {IAccountExpenditureAmountMx} from "../accountExpenditureAmountMx";

export class AccountExpenditureAmountMxCreateDto implements IAccountExpenditureAmountMx{
    @IsInt()
    accountExpenditureAmountMxId: number;
    @IsInt()
    accountExpenditureId: number;
    @IsInt()
    printId: number;
    @IsInt()
    accountId: number;
    @IsNumber()
    amount: number;
    @IsString()
    receivingAccount: string;
    @IsString()
    payee: string;
    @IsString()
    reMack1: string;
    @IsString()
    reMack2: string;
    @IsString()
    reMack3: string;


    constructor(accountExpenditureAmountMx:IAccountExpenditureAmountMx) {
        this.accountExpenditureAmountMxId = accountExpenditureAmountMx.accountExpenditureAmountMxId;
        this.accountExpenditureId = accountExpenditureAmountMx.accountExpenditureId;
        this.printId = accountExpenditureAmountMx.printId;
        this.accountId = accountExpenditureAmountMx.accountId;
        this.amount = accountExpenditureAmountMx.amount;
        this.receivingAccount = accountExpenditureAmountMx.receivingAccount;
        this.payee = accountExpenditureAmountMx.payee;
        this.reMack1 = accountExpenditureAmountMx.reMack1;
        this.reMack2 = accountExpenditureAmountMx.reMack2;
        this.reMack3 = accountExpenditureAmountMx.reMack3;
    }
}