import {IPermissionsTheme} from "../permissionsTheme";
import {IsInt, NotEquals} from "class-validator";

export class PermissionsThemeDeleteDto implements IPermissionsTheme{
    @IsInt()
    @NotEquals(0)
    permissionsThemeId: number;
    permissionsThemeName: string;
    printid: number;
    creater: string;
    createdAt: Date;
    updater: string;
    updatedAt: Date;
    del_uuid: number;
    deleter: string;
    deletedAt: Date;
}