import {IAccount} from "../account";
import {IsInt, IsString} from "class-validator";

export class CreateAccountDto implements IAccount{
    @IsInt()
    //出纳账户Id
    accountId: number;
    //币种Id
    @IsInt()
    currencyid: number;
    //出纳账户编号
    @IsString()
    accountCode: string;
    //出纳账户名称
    @IsString()
    accountName: string;
    //出纳账户类型
    @IsString()
    accountType: string;
    //公户标记
    @IsInt()
    companyFlag: number;
    //新增人
    creater: string;
    //新增时间
    createdAt: Date;
    updater: string;
    //更新时间
    updatedAt: Date;
    useFlag: number;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;
}