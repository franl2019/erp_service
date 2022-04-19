import {IAccountsVerifySheetAndMx} from "../accountsVerifySheet";
import {IsArray, IsDateString, IsInt, IsString} from "class-validator";
import {IAccountsVerifySheetMx} from "../../accountsVerifySheetMx/accountsVerifySheetMx";

export class AccountsVerifySheetUpdateDto implements IAccountsVerifySheetAndMx {
    @IsInt()
    accountsVerifySheetId: number;
    @IsString()
    accountsVerifySheetCode: string;
    @IsInt()
    sheetType: number;
    @IsDateString()
    inDate: Date;
    @IsInt()
    clientid: number;
    @IsInt()
    clientid_b: number;
    @IsInt()
    buyid: number;
    @IsInt()
    buyid_b: number;
    del_uuid: number;
    deleteAt: Date | null;
    deleter: string;
    level1Date: Date | null;
    level1Name: string;
    level1Review: number;
    level2Date: Date | null;
    level2Name: string;
    level2Review: number;
    createdAt: Date | null;
    creater: string;
    updatedAt: Date | null;
    updater: string;
    @IsArray()
    accountsVerifySheetMx: IAccountsVerifySheetMx[];
    @IsString()
    reMark1:string;
    @IsString()
    reMark2:string;
    @IsString()
    reMark3:string;
}