import {IsArray} from "class-validator";
import {RolePermissionsMxCreateDto} from "./rolePermissionsMxCreate.dto";

export class RolePermissionsMxBatchCreateDto {
    @IsArray()
    rolePermissionsMxList:RolePermissionsMxCreateDto[]
}