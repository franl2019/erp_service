import {IsInt, IsString} from "class-validator";
import {AccountCategory} from "../../accountsVerifySheetMx/accountCategory";

export class AccountsPayableFindDto {
    @IsInt()
    accountsPayableId: number;
    @IsInt()
    accountsPayableType:AccountCategory;
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