import {IsInt} from "class-validator";
import {IUserAccountMx} from "../userAccountMx";

export class UserAccountAuthCreateDto implements IUserAccountMx{
    @IsInt()
    userid:number;
    @IsInt()
    accountId:number;
    creater:string;
    createdAt:Date;
    updater:string;
    updatedAt:Date;
}