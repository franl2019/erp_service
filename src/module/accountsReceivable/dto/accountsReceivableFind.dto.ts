import {IsInt, IsString} from "class-validator";
import {AccountCategoryType} from "../../accountsVerifySheetMx/accountCategoryType";

export class AccountsReceivableFindDto {
    @IsInt()
    accountsReceivableId:number;
    @IsInt()
    accountsReceivableType:AccountCategoryType;
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