import {IsInt, IsString} from "class-validator";

export class AccountsReceivableFindDto {
    @IsInt()
    accountsReceivableId:number;
    @IsInt()
    clientid:number;
    @IsInt()
    correlationId: number;
    @IsInt()
    correlationType: number;
    @IsString()
    startDate:string;
    @IsString()
    endDate:string;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
}