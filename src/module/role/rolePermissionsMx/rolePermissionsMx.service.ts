import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {RolePermissionsMxEntity} from "./rolePermissionsMx.entity";
import {RolePermissionsMxCreateDto} from "./dto/rolePermissionsMxCreate.dto";
import {RolePermissionsMxDeleteDto} from "./dto/rolePermissionsMxDelete.dto";
import {UpdateRolePermissionsDto} from "./dto/updateRolePermissions.dto";
import {useVerifyParam} from "../../../utils/verifyParam/useVerifyParam";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {IState} from "../../../decorator/user.decorator";
import {IRolePermissionsMx} from "./rolePermissionsMx";
import {RolePermissionsMxFindAllDto} from "./dto/rolePermissionsMxFindAll.dto";
import {RoleService} from "../role/role.service";
import {UserRoleMxService} from "../../userRoleMx/userRoleMx.service";
import {Cache} from "cache-manager";

@Injectable()
export class RolePermissionsMxService {

    constructor(
        private readonly role: RoleService,
        private readonly rolePermissionsMxEntity: RolePermissionsMxEntity,
        private readonly mysqldbAls: MysqldbAls,
        private readonly userRoleMxService: UserRoleMxService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
    }

    public async findAll(rolePermissionsMxFindAllDto: RolePermissionsMxFindAllDto) {
        return await this.rolePermissionsMxEntity.findAll(rolePermissionsMxFindAllDto);
    }

    public async findByRoleId(roleId: number) {
        return await this.rolePermissionsMxEntity.findByRoleId(roleId);
    }

    public async findOne(roleId: number, permissionsId: number) {
        return await this.rolePermissionsMxEntity.findOne(roleId, permissionsId)
    }

    public async create(rolePermissionsMx: RolePermissionsMxCreateDto) {
        return await this.rolePermissionsMxEntity.create(rolePermissionsMx);
    }

    public async update(rolePermissionsMxBatchCreateDto: UpdateRolePermissionsDto, state: IState) {
        const roleId = rolePermissionsMxBatchCreateDto.roleId;
        //检查是否存在角色
        await this.role.findOne(roleId);
        const username = state.user.username;
        const updatedAt = new Date();
        const rolePermissionsMxListSuccessVerifyParam: IRolePermissionsMx[] = [];
        //检查权限更新明细是否格式正确
        for (let i = 0; i < rolePermissionsMxBatchCreateDto.rolePermissionsMxList.length; i++) {
            const rolePermissionsMx = rolePermissionsMxBatchCreateDto.rolePermissionsMxList[i];
            const rolePermissionsMxCreateDto = new RolePermissionsMxCreateDto(
                roleId,
                rolePermissionsMx.permissionsId,
                username,
                updatedAt,
                rolePermissionsMx.can,
            );
            await useVerifyParam(rolePermissionsMxCreateDto)
            rolePermissionsMxListSuccessVerifyParam.push(rolePermissionsMxCreateDto)
        }

        await this.mysqldbAls.sqlTransaction(async () => {
            for (let i = 0; i < rolePermissionsMxListSuccessVerifyParam.length; i++) {
                const rolePermissionsMx = rolePermissionsMxListSuccessVerifyParam[i];
                const rolePermissionsMxInDB = await this.rolePermissionsMxEntity.isExist(roleId, rolePermissionsMx.permissionsId);
                const permissionsActivate = Boolean(rolePermissionsMx.can);
                //如果权限启用,角色也没有权限
                if (permissionsActivate === true && rolePermissionsMxInDB === false) {
                    //创建角色权限
                    await this.create(rolePermissionsMx);
                }

                //如果权限禁用,角色也有权限
                if (permissionsActivate === false && rolePermissionsMxInDB === true) {
                    //删除角色权限
                    await this.delete_data(rolePermissionsMx);
                }
            }
        })


        await this.clearUserPermissionsCache(roleId);

        return true
    }

    public async clearUserPermissionsCache(roleId: number) {
        const userRoleMxList = await this.userRoleMxService.findByRoleId(roleId);
        const userIdList = userRoleMxList.map(userRoleMx => userRoleMx.userid);
        for (let i = 0; i < userIdList.length; i++) {
            const userId = userIdList[i];
            await this.cacheManager.del(String(userId));
        }
    }

    public async delete_data(rolePermissionsMx: RolePermissionsMxDeleteDto) {
        return await this.rolePermissionsMxEntity.delete_data(rolePermissionsMx);
    }
}