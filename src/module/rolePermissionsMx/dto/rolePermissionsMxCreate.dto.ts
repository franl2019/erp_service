import {IRolePermissionsMx} from "../rolePermissionsMx";
import {IsInt} from "class-validator";

export class RolePermissionsMxCreateDto implements IRolePermissionsMx{
    @IsInt()
    roleId:number;
    @IsInt()
    permissionsId:number;
    updater:string;
    updatedAt:string;
}