import {Injectable} from "@nestjs/common";
import {RolePermissionsMxEntity} from "./rolePermissionsMx.entity";
import {RolePermissionsMxCreateDto} from "./dto/rolePermissionsMxCreate.dto";
import {RolePermissionsMxDeleteDto} from "./dto/rolePermissionsMxDelete.dto";
import {RolePermissionsMxBatchCreateDto} from "./dto/rolePermissionsMxBatchCreate.dto";
import {useVerifyParam} from "../../../utils/useVerifyParam";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {IState} from "../../../decorator/user.decorator";
import {IRolePermissionsMx} from "./rolePermissionsMx";

@Injectable()
export class RolePermissionsMxService {

    constructor(
        private readonly rolePermissionsMxEntity: RolePermissionsMxEntity,
        private readonly mysqldbAls: MysqldbAls
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

    public async createBatch(rolePermissionsMxBatchCreateDto: RolePermissionsMxBatchCreateDto,state:IState) {
        const username = state.user.username;
        const updatedAt = new Date();
        const rolePermissionsMxListSuccessVerifyParam:IRolePermissionsMx[] = [];
        for (let i = 0; i < rolePermissionsMxBatchCreateDto.rolePermissionsMxList.length; i++) {
            const rolePermissionsMx = rolePermissionsMxBatchCreateDto.rolePermissionsMxList[i];
            const rolePermissionsMxCreateDto = new RolePermissionsMxCreateDto(
                rolePermissionsMx.roleId,
                rolePermissionsMx.permissionsId,
                username,
                updatedAt
            );
            await useVerifyParam(rolePermissionsMxCreateDto)
            rolePermissionsMxListSuccessVerifyParam.push(rolePermissionsMxCreateDto)
        }

        await this.mysqldbAls.sqlTransaction(async () => {
            for (let i = 0; i < rolePermissionsMxListSuccessVerifyParam.length; i++) {
                const rolePermissionsMx = rolePermissionsMxListSuccessVerifyParam[i];
                await this.create(rolePermissionsMx);
            }
        })
        return true
    }

    public async delete_data(rolePermissionsMx: RolePermissionsMxDeleteDto) {
        return await this.rolePermissionsMxEntity.delete_data(rolePermissionsMx);
    }
}