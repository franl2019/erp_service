export interface IAccountsPayable {
    accountsPayableId: number;
    buyid: number;
    inDate: Date;
    amounts: number;
    checkedAmounts: number;
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

export interface IAccountsPayableFind extends IAccountsPayable {
    buyname: string;
}