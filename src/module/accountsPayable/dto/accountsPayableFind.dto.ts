import {IsInt, IsString} from "class-validator";
import {AccountCategoryType} from "../../accountsVerifySheetMx/accountCategoryType";

export class AccountsPayableFindDto {
    @IsInt()
    accountsPayableId: number;
    @IsInt()
    accountsPayableType:AccountCategoryType;
    @IsInt()
    buyid: number;
    @IsInt()
    correlationId: number;
    @IsInt()
    correlationType: number;
    @IsString()
    startDate: string;
    @IsString()
    endDate: string;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
}