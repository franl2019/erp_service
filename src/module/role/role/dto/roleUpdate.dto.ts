import {IsInt, NotEquals} from "class-validator";
import {RoleCreateDto} from "./roleCreate.dto";

export class RoleUpdateDto extends RoleCreateDto{
    @IsInt()
    @NotEquals(0)
    roleId: number
}