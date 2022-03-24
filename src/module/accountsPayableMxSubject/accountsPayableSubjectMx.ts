export interface IAccountsPayableSubjectMx {
    accountsPayableSubjectMxId: number;
    //应付账款Id
    accountsPayableId: number;
    //相关单号
    correlationId: number;
    //相关单号类型
    correlationType: number;
    //发生日期
    inDate: Date;
    //借方
    debit: number;
    //贷方
    credit: number;
    //创建人
    creater: string;
    //创建日期
    createdAt: Date;
    //摘要
    abstract: string;
    //备注
    reMark: string;
}