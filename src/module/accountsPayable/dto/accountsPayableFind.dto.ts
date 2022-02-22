import {IsInt, IsString} from "class-validator";

export class AccountsPayableFindDto {
    @IsInt()
    accountsPayableId:number;
    @IsInt()
    buyid:number;
    @IsString()
    startDate:string;
    @IsString()
    endDate:string;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
}