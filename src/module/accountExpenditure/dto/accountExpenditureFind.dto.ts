import {IsArray, IsInt, IsNumber, IsString} from "class-validator";

export class AccountExpenditureFindDto {
    @IsInt()
    accountExpenditureId: number;
    @IsString()
    accountExpenditureCode: string;
    @IsString()
    collectionAccount:string
    @IsString()
    payee:string
    @IsNumber()
    expenditureAmt:number
    @IsString()
    startDate: string;
    @IsString()
    endDate: string;
    @IsArray()
    accountIds: number[];
    @IsInt()
    buyid: number;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
}