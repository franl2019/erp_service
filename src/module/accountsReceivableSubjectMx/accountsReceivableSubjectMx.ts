export interface IAccountsReceivableSubjectMx {
    accountsReceivableSubjectMxId: number;
    accountsReceivableId: number;
    correlationId: number;
    correlationType: number;
    inDate: Date;
    //借方
    debit: number;
    //贷方
    credit: number;
    creater: string;
    createdAt: Date;
    abstract: string;
    reMark: string;
}