import {IRolePermissionsMx} from "../rolePermissionsMx";
import {IsInt} from "class-validator";

export class RolePermissionsMxCreateDto implements IRolePermissionsMx{
    @IsInt()
    roleId:number;
    @IsInt()
    permissionsId:number;
    updater:string;
    updatedAt:Date;


    constructor(roleId: number, permissionsId: number, updater: string, updatedAt: Date) {
        this.roleId = roleId;
        this.permissionsId = permissionsId;
        this.updater = updater;
        this.updatedAt = updatedAt;
    }
}