export interface IAccountsPayableMx {
    accountsPayableMxId: number;
    accountsPayableId: number;
    //相关单据Id
    correlationId: number;
    //相关单据类型
    correlationType: number;
    inDate: Date;
    //预付款
    advancesPayment: number;
    //应付款
    accountPayable: number;
    //实付款
    actuallyPayment: number;
    //摘要
    abstract: string;
    reMark: string;
    creater: string;
    createdAt: Date | null;
    updater: string;
    updatedAt: Date | null;
}