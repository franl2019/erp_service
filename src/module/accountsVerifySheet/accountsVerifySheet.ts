import {IAccountsVerifySheetMx} from "../accountsVerifySheetMx/accountsVerifySheetMx";
import {AccountsVerifySheetType} from "./accountsVerifySheetType";

export interface IAccountsVerifySheet {
    accountsVerifySheetId: number;
    accountsVerifySheetCode: string;
    sheetType: AccountsVerifySheetType;
    inDate: Date;
    clientid: number;
    clientid_b: number;
    buyid: number;
    buyid_b: number;
    creater: string;
    createdAt: Date | null;
    updater: string;
    updatedAt: Date | null;
    level1Review: number;
    level1Name: string;
    level1Date: Date | null;
    level2Review: number;
    level2Name: string;
    level2Date: Date | null;
    del_uuid: number;
    deleter: string;
    deleteAt: Date | null;
    reMark1:string;
    reMark2:string;
    reMark3:string;
}

export interface IAccountsVerifySheetFind extends IAccountsVerifySheet {

}

export interface IAccountsVerifySheetAndMx extends IAccountsVerifySheet{
    accountsVerifySheetMx:IAccountsVerifySheetMx[]
}