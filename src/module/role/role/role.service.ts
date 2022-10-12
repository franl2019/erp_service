import {Injectable} from "@nestjs/common";
import {RoleEntity} from "./role.entity";
import {RoleCreateDto} from "./dto/roleCreate.dto";
import {RoleUpdateDto} from "./dto/roleUpdate.dto";

@Injectable()
export class RoleService {

    constructor(
        private readonly roleEntity: RoleEntity
    ) {
    }

    public async findAll() {
        return await this.roleEntity.findAll();
    }

    public async findOne(roleId: number) {
        return await this.roleEntity.findOne(roleId);
    }

    public async create(role: RoleCreateDto) {
        return await this.roleEntity.create(role);
    }

    public async update(role: RoleUpdateDto) {
        return await this.roleEntity.update(role);
    }

    public async delete_data(roleId: number, username: string) {
        return await this.roleEntity.delete_data(roleId, username);
    }
}