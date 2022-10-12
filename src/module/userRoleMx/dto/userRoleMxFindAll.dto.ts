import {IUserRoleMx} from "../userRoleMx";
import {IsInt, NotEquals} from "class-validator";

export class UserRoleMxFindAllDto implements IUserRoleMx{
    @IsInt()
    @NotEquals(0)
    userid: number;
    roleId: number;
    creater: string;
    createdAt: Date;
}