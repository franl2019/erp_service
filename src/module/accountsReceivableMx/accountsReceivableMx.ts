export interface IAccountsReceivableMx {
    accountReceivableMxId: number;
    accountsReceivableId: number;
    //相关单据Id
    correlationId: number;
    //相关单据类型
    correlationType: number;
    inDate: Date;
    //预收款
    advancesReceived: number;
    //应收款
    receivables: number;
    //实收款
    actuallyReceived: number;
    //摘要
    abstract: string;
    reMark: string;
    creater: string;
    createdAt: Date | null;
    updater: string;
    updatedAt: Date | null;
}