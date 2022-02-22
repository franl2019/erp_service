export interface IUserAccountMx{
    userid:number;
    accountId:number;
    creater:string;
    createdAt:Date;
    updater:string;
    updatedAt:Date;
}

export interface IUserAccountMxFind extends IUserAccountMx{
    accountName:string;
}