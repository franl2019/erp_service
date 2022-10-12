import {IPermissionsTheme} from "../permissionsTheme";
import {IsInt, IsString, NotEquals} from "class-validator";

export class PermissionsThemeUpdateDto implements IPermissionsTheme{
    @IsInt()
    @NotEquals(0)
    permissionsThemeId: number;
    @IsString()
    permissionsThemeName: string;
    @IsInt()
    printid: number;
    creater: string;
    createdAt: Date;
    updater: string;
    updatedAt: Date;
    del_uuid: number;
    deleter: string;
    deletedAt: Date;
}