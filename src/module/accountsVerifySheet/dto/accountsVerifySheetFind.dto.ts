import {IsInt, IsString} from "class-validator";

export class AccountsVerifySheetFindDto {
    @IsInt()
    accountsVerifySheetId: number;
    @IsString()
    accountsVerifySheetCode: string;
    @IsInt()
    sheetType: number;
    @IsInt()
    clientid: number;
    @IsInt()
    clientid_b: number;
    @IsInt()
    buyid: number;
    @IsInt()
    buyid_b: number;
    @IsInt()
    level1Review: number;
    @IsInt()
    level2Review: number;
    @IsString()
    startDate:string;
    @IsString()
    endDate:string;
    @IsInt()
    page:number;
    @IsInt()
    pagesize:number;
}