import {IsInt, IsString} from "class-validator";

export class AccountExpenditureFindDto {
    @IsInt()
    accountExpenditureId: number;
    @IsString()
    accountExpenditureCode: string;
    @IsInt()
    accountExpenditureType:number;
    @IsString()
    startDate: string;
    @IsString()
    endDate: string;
    @IsInt()
    buyid: number;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
}