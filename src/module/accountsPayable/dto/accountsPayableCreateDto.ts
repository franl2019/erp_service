import {IsDateString, IsInt, IsNumber} from "class-validator";
import { AccountCategoryType } from "src/module/accountsVerifySheetMx/accountCategoryType";
import { CodeType } from "src/module/autoCode/codeType";
import {IAccountsPayable} from "../accountsPayable";

export class AccountsPayableCreateDto implements IAccountsPayable {
    accountsPayableId: number;
    @IsInt()
    accountsPayableType: AccountCategoryType;
    @IsInt()
    buyid: number;
    @IsDateString()
    inDate: Date;
    @IsNumber()
    amounts: number;
    @IsNumber()
    checkedAmounts: number;
    @IsNumber()
    notCheckAmounts: number;
    @IsInt()
    correlationId: number;
    @IsInt()
    correlationType: CodeType;
    creater: string;
    createdAt: Date | null;
    updater: string;
    updatedAt: Date | null;
    del_uuid: number;
    deleter: string;
    deletedAt: Date | null;


}