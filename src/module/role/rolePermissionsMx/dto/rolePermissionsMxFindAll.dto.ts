import {IRolePermissionsMx} from "../rolePermissionsMx";
import {IsInt, IsString} from "class-validator";
import {IPermissions} from "../../../permission/permissions/permissions";

export class RolePermissionsMxFindAllDto implements IRolePermissionsMx,IPermissions {
    @IsInt()
    roleId: number;

    @IsInt()
    permissionsCode: number;
    @IsString()
    permissionsName: string;
    @IsInt()
    permissionsThemeId: number;
    @IsInt()
    can: number;
    permissionsId: number;
    updatedAt: Date;
    updater: string;
    createdAt: Date;
    creater: string;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;

    constructor(roleId: number) {
        this.roleId = roleId;
    }
}