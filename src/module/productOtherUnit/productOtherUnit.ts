export interface IProductOtherUnit {
    //id
    productOtherUnitId: number;

    //辅助单位名称
    productOtherUnitName: string;

    //辅助单位转换率
    defaultConversionRate: number;

    //使用率
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