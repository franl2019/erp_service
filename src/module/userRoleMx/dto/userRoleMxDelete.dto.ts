import {IUserRoleMx} from "../userRoleMx";
import {IsInt, NotEquals} from "class-validator";

export class UserRoleMxDeleteDto implements IUserRoleMx{
    @IsInt()
    @NotEquals(0)
    userid: number;
    @IsInt()
    @NotEquals(0)
    roleId: number;
    creater: string;
    createdAt: Date;
}