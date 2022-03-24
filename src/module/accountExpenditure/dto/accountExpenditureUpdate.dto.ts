import {IsArray, IsDateString, IsInt, IsNumber, IsString} from "class-validator";
import {IAccountExpenditureCreate} from "./accountExpenditureCreate.dto";
import {IAccountExpenditureSheetMx} from "../../accountExpenditureSheetMx/accountExpenditureSheetMx";
import {IAccountExpenditureAmountMx} from "../../accountExpenditureAmountMx/accountExpenditureAmountMx";

export class AccountExpenditureUpdateDto implements IAccountExpenditureCreate {
    @IsInt()
    accountExpenditureId: number;
    @IsString()
    accountExpenditureCode: string;
    //供应商
    @IsInt()
    buyid: number;
    //发生日期
    @IsDateString()
    indate: Date;
    //付款单类型
    @IsInt()
    accountExpenditureType: number;
    //总金额
    @IsNumber()
    amount: number;
    @IsString()
    reMark: string;
    creater: string;
    createdAt: Date;
    updater: string;
    updatedAt: Date;
    level1Review: number;
    level1Name: string;
    level1Date: Date;
    level2Review: number;
    level2Name: string;
    level2Date: Date;
    del_uuid: number;
    deleter: string
    deletedAt: Date;
    @IsArray()
    accountExpenditureAmountMx: IAccountExpenditureAmountMx[];
    @IsArray()
    accountExpenditureSheetMx: IAccountExpenditureSheetMx[];

}