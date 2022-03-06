import {IsDateString, IsInt, IsNumber, IsString} from "class-validator";
import {IAccountInCome} from "../accountInCome";

export class AccountInComeUpdateDto implements IAccountInCome{
    @IsInt()
    accountInComeId: number;
    accountInComeCode: string;
    @IsInt()
    accountInComeType: number;
    @IsNumber()
    amount: number;
    @IsInt()
    clientid: number;
    @IsDateString()
    indate: Date;
    @IsString()
    reMark: string;
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