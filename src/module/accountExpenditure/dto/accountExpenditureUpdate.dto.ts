import {IAccountExpenditure} from "../accountExpenditure";
import {IsDateString, IsInt, IsNumber, IsString } from "class-validator";

export class AccountExpenditureUpdateDto implements IAccountExpenditure {
    @IsString()
    accountExpenditureCode: string;
    @IsInt()
    accountExpenditureId: number;
    @IsInt()
    accountId: number;
    @IsInt()
    buyid: number;
    @IsDateString()
    indate: Date;
    @IsString()
    reMark: string;
    @IsString()
    collectionAccount: string;
    @IsNumber()
    expenditureAmt: number;
    @IsString()
    payee: string;
    createdAt: Date;
    creater: string;
    updatedAt: Date;
    updater: string;
    level1Date: Date;
    level1Name: string;
    level1Review: number;
    level2Date: Date;
    level2Name: string;
    level2Review: number;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;
}