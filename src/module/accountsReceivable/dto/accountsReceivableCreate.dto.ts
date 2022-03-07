import {IAccountsReceivable} from "../accountsReceivable";
import {IsDateString, IsInt, IsNumber} from "class-validator";
import { AccountCategory } from "src/module/accountsVerifySheetMx/accountCategory";
import { CodeType } from "src/module/autoCode/codeType";

export class AccountsReceivableCreateDto implements IAccountsReceivable{
    accountsReceivableId: number;
    accountsReceivableType: AccountCategory;
    @IsInt()
    clientid: number;
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