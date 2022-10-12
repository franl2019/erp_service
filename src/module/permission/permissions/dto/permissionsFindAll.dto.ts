import {IPermissions} from "../permissions";
import {IsInt, IsString} from "class-validator";

export class PermissionsFindAllDto implements IPermissions {
    @IsInt()
    permissionsId: number;
    @IsString()
    permissionsName: string;
    @IsInt()
    permissionsThemeId: number;
    creater: string;
    createdAt: Date;
    updatedAt: Date;
    updater: string;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;
}