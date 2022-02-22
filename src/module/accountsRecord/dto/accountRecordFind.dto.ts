import {IsArray, IsInt, IsNumber, IsString} from "class-validator";

export class IAccountRecordFindDto {
    accountIds: number[];
    accountRecordId: number;
    debitQty: number;
    creditQty: number;
    reMark: string;
    relatedNumber: string;
    startDate: string;
    endDate: string;
    page: number;
    pagesize: number;

}

export class AccountRecordFindDto implements IAccountRecordFindDto {
    @IsArray()
    accountIds: number[];
    @IsInt()
    accountRecordId: number;
    @IsNumber()
    creditQty: number;
    @IsNumber()
    debitQty: number;
    @IsString()
    endDate: string;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
    @IsString()
    startDate: string;
    @IsString()
    reMark: string;
    @IsString()
    relatedNumber: string;
}