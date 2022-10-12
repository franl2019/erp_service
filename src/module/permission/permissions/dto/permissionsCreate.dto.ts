import {IPermissions} from "../permissions";
import {IsInt, IsString, NotEquals} from "class-validator";

export class PermissionsCreateDto implements IPermissions {
    permissionsId: number;
    @IsString()
    permissionsName: string;
    @IsInt()
    @NotEquals(0)
    permissionsThemeId: number;
    creater: string;
    createdAt: Date;
    updatedAt: Date;
    updater: string;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;
}