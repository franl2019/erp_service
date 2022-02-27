import {IAccountsVerifySheetMx} from "../accountsVerifySheetMx/accountsVerifySheetMx";

export interface IAccountsVerifySheet {
    accountsVerifySheetId: number;
    accountsVerifySheetCode: string;
    /*
    * 核销单类型
    * [1]预收冲应收 客户A                明细A：预收  -    明细B：应收   -
    * [2]预付冲应付 供应商A              明细A：预付  -    明细B：应付   -
    * [3]应收冲应付 客户A   供应商A       明细A：客户A应收  - 明细B：客户A应收 -
    * [4]应收转应收 冲客户A   客户B生成    明细A：客户A应收  -
    * [5]应付转应付 冲供应商A 供应商B生成   明细A：供应商A应收 -
    * */
    sheetType: number;
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
}

export interface IAccountsVerifySheetFind extends IAccountsVerifySheet {

}

export interface IAccountsVerifySheetAndMx extends IAccountsVerifySheet{
    accountsVerifySheetMx:IAccountsVerifySheetMx[]
}