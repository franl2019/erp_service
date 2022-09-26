import {Injectable} from "@nestjs/common";
import {RolePermissionsMxEntity} from "./rolePermissionsMx.entity";
import {RolePermissionsMxCreateDto} from "./dto/rolePermissionsMxCreate.dto";
import {RolePermissionsMxDeleteDto} from "./dto/rolePermissionsMxDelete.dto";

@Injectable()
export class RolePermissionsMxService {

    constructor(
        private readonly rolePermissionsMxEntity: RolePermissionsMxEntity
    ) {
    }

    public async findAll(roleId: number) {
        return await this.rolePermissionsMxEntity.findAll(roleId);
    }

    public async findOne(roleId: number, permissionsId: number) {
        return await this.rolePermissionsMxEntity.findOne(roleId, permissionsId)
    }

    public async create(rolePermissionsMx: RolePermissionsMxCreateDto) {
        return await this.rolePermissionsMxEntity.create(rolePermissionsMx);
    }

    public async delete_data(rolePermissionsMx: RolePermissionsMxDeleteDto) {
        return await this.rolePermissionsMxEntity.delete_data(rolePermissionsMx);
    }
}