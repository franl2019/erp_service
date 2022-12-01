import {IRolePermissionsMx} from "../rolePermissionsMx";
import {IsInt} from "class-validator";

export class RolePermissionsMxDeleteDto implements IRolePermissionsMx{
    @IsInt()
    roleId:number;
    @IsInt()
    permissionsId:number;
    updater:string;
    updatedAt:Date;
    can:number
}