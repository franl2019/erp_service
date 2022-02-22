export interface IAccountExpenditure {
    accountExpenditureId: number;
    accountExpenditureCode: string;
    //收款账号
    collectionAccount:string;
    //收款人
    payee:string;
    //支出金额
    expenditureAmt:number;
    indate: Date;
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
    accountId: number;
    buyid: number;
    del_uuid:number;
    deleter:string
    deletedAt:Date;
}

export interface IAccountExpenditureFind extends IAccountExpenditure{
    accountName:string;
    buyname:string;
}