import {IAccountsPayable} from "../accountsPayable";
import {IsDateString, IsInt, IsNumber} from "class-validator";

export class AccountsPayableUpdateDto implements IAccountsPayable {
    @IsInt()
    accountsPayableId: number;
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
    correlationType: number;
    creater: string;
    createdAt: Date | null;
    updater: string;
    updatedAt: Date | null;
    del_uuid: number;
    deleter: string;
    deletedAt: Date | null;
}