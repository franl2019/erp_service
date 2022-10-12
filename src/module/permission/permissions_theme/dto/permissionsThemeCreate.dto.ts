import {IPermissionsTheme} from "../permissionsTheme";
import {IsInt, IsString} from "class-validator";

export class PermissionsThemeCreateDto implements IPermissionsTheme{
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