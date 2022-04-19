import {IsArray, IsInt, IsNumber, IsString} from "class-validator";
import {AccountCategoryType} from "../../accountsVerifySheetMx/accountCategoryType";

export class AccountsReceivableFindDto {
    @IsInt()
    accountsReceivableId:number;
    @IsArray()
    accountsReceivableTypeList:AccountCategoryType[];
    @IsInt()
    clientid:number;

    @IsInt()
    correlationId: number;
    @IsInt()
    correlationType: number;
    @IsString()
    correlationCode: string;

    @IsNumber()
    amounts:number;
    @IsNumber()
    checkedAmounts:number;
    @IsNumber()
    notCheckAmounts:number;


    @IsString()
    startDate:string;
    @IsString()
    endDate:string;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
}