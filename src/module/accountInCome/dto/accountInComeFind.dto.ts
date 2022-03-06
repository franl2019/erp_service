import { IsInt, IsNumber, IsString} from "class-validator";

export class AccountInComeFindDto {
    @IsInt()
    accountInComeId: number;
    @IsString()
    accountInComeCode: string;
    @IsInt()
    accountInComeType: number;
    @IsInt()
    clientid: number;
    //应收账款金额
    @IsNumber()
    amount: number;
    //付款账号
    @IsString()
    paymentAccount: string;
    @IsString()
    startDate: string;
    @IsString()
    endDate: string;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
}