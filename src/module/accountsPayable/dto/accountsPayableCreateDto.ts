import {IsDateString, IsInt, IsNumber} from "class-validator";
import { AccountCategory } from "src/module/accountsVerifySheetMx/accountCategory";
import { CodeType } from "src/module/autoCode/codeType";
import {IAccountsPayable} from "../accountsPayable";

export class AccountsPayableCreateDto implements IAccountsPayable {
    accountsPayableId: number;
    @IsInt()
    accountsPayableType: AccountCategory;
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