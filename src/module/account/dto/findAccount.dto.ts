import {IsInt, IsString} from "class-validator";

export interface IFindAccountDto {
    accountId:number;
    currencyid:number;
    accountCode:string;
    accountName:string;
    accountType:string;
    companyFlag:number;
    useFlag:number;
}

export class FindAccountDto implements IFindAccountDto{
    @IsString()
    accountCode: string;
    @IsInt()
    accountId: number;
    @IsString()
    accountName: string;
    @IsString()
    accountType: string;
    @IsInt()
    companyFlag: number;
    @IsInt()
    currencyid: number;
    @IsInt()
    useFlag: number;
}