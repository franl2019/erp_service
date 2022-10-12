import {IPermissions} from "../permissions";
import {IsInt, NotEquals} from "class-validator";

export class PermissionsDeleteDto implements IPermissions {
    @IsInt()
    @NotEquals(0)
    permissionsId: number;
    permissionsName: string;
    permissionsThemeId: number;
    creater: string;
    createdAt: Date;
    updatedAt: Date;
    updater: string;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;
}