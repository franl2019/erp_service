import {IUser} from "../user/user";

export interface IUserRoleMx {
    userid:number;
    roleId:number;
    creater:string;
    createdAt:Date;
}

export interface IUserRoleMxJoinUser extends IUserRoleMx,IUser {
}