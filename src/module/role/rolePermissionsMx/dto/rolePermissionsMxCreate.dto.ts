import {IRolePermissionsMx} from "../rolePermissionsMx";
import {IsInt} from "class-validator";

export class RolePermissionsMxCreateDto implements IRolePermissionsMx {
    roleId: number;
    @IsInt()
    permissionsId: number;
    updater: string;
    updatedAt: Date;
    @IsInt()
    can: number;

    constructor(roleId: number, permissionsId: number, updater: string, updatedAt: Date, can: number) {
        this.roleId = roleId;
        this.permissionsId = permissionsId;
        this.updater = updater;
        this.updatedAt = updatedAt;
        this.can = can
    }
}