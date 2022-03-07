import {IsInt, IsString} from "class-validator";
import {AccountCategory} from "../../accountsVerifySheetMx/accountCategory";

export class AccountsReceivableFindDto {
    @IsInt()
    accountsReceivableId:number;
    @IsInt()
    accountsReceivableType:AccountCategory;
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