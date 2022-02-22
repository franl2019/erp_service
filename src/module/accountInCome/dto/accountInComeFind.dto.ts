import {IsArray, IsInt, IsNumber, IsString} from "class-validator";

export class AccountInComeFindDto {
    @IsInt()
    accountInComeId: number;
    @IsString()
    accountInComeCode: string;
    //应收账款金额
    @IsNumber()
    payableAmt: number;
    //出纳收入金额
    @IsNumber()
    revenueAmt: number
    //付款账号
    @IsString()
    paymentAccount: string;
    @IsString()
    startDate: string;
    @IsString()
    endDate: string;
    @IsArray()
    accountIds: number[];
    @IsInt()
    clientid: number;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
}