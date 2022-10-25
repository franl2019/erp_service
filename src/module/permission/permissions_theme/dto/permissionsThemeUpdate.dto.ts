import {IsInt, NotEquals} from "class-validator";
import {PermissionsThemeCreateDto} from "./permissionsThemeCreate.dto";

export class PermissionsThemeUpdateDto extends PermissionsThemeCreateDto{
    @IsInt()
    @NotEquals(0)
    permissionsThemeId: number;
}