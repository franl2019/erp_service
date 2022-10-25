import {Injectable} from "@nestjs/common";
import {RoleEntity} from "./role.entity";
import {RoleCreateDto} from "./dto/roleCreate.dto";
import {RoleUpdateDto} from "./dto/roleUpdate.dto";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";

@Injectable()
export class RoleService {

    constructor(
        private readonly roleEntity: RoleEntity,
        private readonly mysqldbAls: MysqldbAls,
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

    public async update(roleUpdateDto: RoleUpdateDto) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const role = await this.roleEntity.findOne(roleUpdateDto.roleId);

            //角色禁用,更新为启用,更新使用时间
            if (role.useflag === 0 && roleUpdateDto.useflag === 1) {
                roleUpdateDto.useflagDate = new Date();
            }

            //角色启用,更新为禁用,更新使用时间
            if (role.useflag === 1 && roleUpdateDto.useflag === 0) {
                roleUpdateDto.useflagDate = null;
            }

            //角色启用,更新还是启用,时间不变
            if (role.useflag === 1 && roleUpdateDto.useflag === 1) {
                roleUpdateDto.useflagDate = role.useflagDate;
            }


            return await this.roleEntity.update(roleUpdateDto);
        })
    }

    public async delete_data(roleId: number, username: string) {
        return await this.roleEntity.delete_data(roleId, username);
    }
}