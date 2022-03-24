export interface IAccountInCome {
    accountInComeId: number;
    accountInComeCode: string;
    //客户
    clientid: number;
    //发生日期
    indate: Date;
    //收款单类型
    accountInComeType:number;
    //总金额
    amount: number;
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

}