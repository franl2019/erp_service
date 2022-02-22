import {IAccountInCome} from "../accountInCome";
import {IsDateString, IsInt, IsNumber, IsString} from "class-validator";

export class AccountInComeCreateDto implements IAccountInCome {
    @IsInt()
    accountId: number;
    accountInComeCode: string;
    accountInComeId: number;
    @IsInt()
    clientid: number;
    @IsInt()
    currencyid: number;
    @IsNumber()
    exchangeRate: number;
    @IsDateString()
    indate: Date;
    @IsNumber()
    payableAmt: number;
    @IsString()
    paymentAccount: string;
    @IsString()
    reMark: string;
    @IsNumber()
    revenueAmt: number;
    creater: string;
    createdAt: Date;
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