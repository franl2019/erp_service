import {IProductOtherUnit} from "../productOtherUnit";
import {IsInt, IsString, NotEquals} from "class-validator";

export class ProductOtherUnitUpdateDto implements IProductOtherUnit{
    //id
    @IsInt()
    @NotEquals(0)
    productOtherUnitId: number;

    //辅助单位名称
    @IsString()
    productOtherUnitName: string;

    //辅助单位转换率
    @IsInt()
    @NotEquals(0)
    defaultConversionRate: number;

    //使用率
    @IsInt()
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
}