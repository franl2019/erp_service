import {IPermissions} from "../permissions";
import {IsInt, IsString, NotEquals} from "class-validator";

export class PermissionsUpdateDto implements IPermissions {
    @IsInt()
    @NotEquals(0)
    permissionsId: number;
    @IsString()
    permissionsName: string;
    @IsInt()
    permissionsCode:number;
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