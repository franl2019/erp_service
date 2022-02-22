export interface IAccountInCome {
    accountInComeId: number;
    accountInComeCode: string;
    clientid: number;
    indate: Date;
    //应收账款金额
    payableAmt: number;
    currencyid: number;
    //付款账号
    paymentAccount: string;
    //汇率
    exchangeRate: number;
    accountId: number
    //出纳收入金额
    revenueAmt: number
    //备注
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
    deleter: string;
    deletedAt: Date;
}

export interface IAccountInComeFind extends IAccountInCome {
    accountName: string;
    clientname: string;
    currencyname:string
}