import {IsArray, IsInt, NotEquals} from "class-validator";
import {RolePermissionsMxCreateDto} from "./rolePermissionsMxCreate.dto";

export class UpdateRolePermissionsDto {
    @IsInt()
    @NotEquals(0)
    roleId:number;
    @IsArray()
    rolePermissionsMxList:RolePermissionsMxCreateDto[]
}