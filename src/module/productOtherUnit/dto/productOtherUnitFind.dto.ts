import {IProductOtherUnit} from "../productOtherUnit";
import {IsInt, IsString} from "class-validator";
import {IProductOtherUnitMx} from "../../productOtherUnitMx/productOtherUnitMx";

export class ProductOtherUnitFindDto implements IProductOtherUnit,IProductOtherUnitMx{
    //id
    @IsInt()
    productOtherUnitId: number;

    //辅助单位名称
    @IsString()
    productOtherUnitName: string;

    //辅助单位转换率
    @IsInt()
    defaultConversionRate: number;

    //使用
    useflag: number;

    //使用日期
    useflagDate: Date;


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
    deleter: string;
    deletedAt: Date;

    @IsInt()
    productid: number;
    conversionRate: number;
}