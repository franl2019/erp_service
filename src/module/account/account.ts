export interface IAccount {
    //出纳账户Id
    accountId: number;
    //币种Id
    currencyid: number;
    //出纳账户编号
    accountCode: string;
    //出纳账户名称
    accountName: string;
    //出纳账户类型
    accountType: string;
    //公户标记
    companyFlag: number;
    //新增人
    creater: string;
    //新增时间
    createdAt: Date;
    //更新人
    updater: string;
    //更新时间
    updatedAt: Date;
    //使用标记
    useFlag: number;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;
}

export class Account implements IAccount  {
    //出纳账户Id
    accountId: number;
    //币种Id
    currencyid: number;
    //出纳账户编号
    accountCode: string;
    //出纳账户名称
    accountName: string;
    //出纳账户类型
    accountType: string;
    //公户标记
    companyFlag: number;
    //新增人
    creater: string;
    //新增时间
    createdAt: Date;
    //更新人
    updater: string;
    //更新时间
    updatedAt: Date;
    //使用标记
    useFlag: number;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;


    constructor() {
        this.accountId = null;
        this.currencyid = null;
        this.accountCode = null;
        this.accountName = null;
        this.accountType = null;
        this.companyFlag = null;
        this.creater = null;
        this.createdAt = null;
        this.updater = null;
        this.updatedAt = null;
        this.useFlag = null;
        this.del_uuid = null;
        this.deletedAt = null;
        this.deleter = null;
    }


}