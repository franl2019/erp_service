export interface IAccountsReceivable {
    accountsReceivableId: number;
    clientid: number;
    inDate: Date;
    //单据金额
    amounts: number;
    //已核销金额
    checkedAmounts: number;
    //未核销金额
    notCheckAmounts: number;
    correlationId: number;
    correlationType: number;
    creater: string;
    createdAt: Date | null;
    updater: string;
    updatedAt: Date | null;
    del_uuid: number;
    deleter: string;
    deletedAt: Date | null;
}

export interface IAccountsReceivableFind extends IAccountsReceivable {
    clientname: string;
}