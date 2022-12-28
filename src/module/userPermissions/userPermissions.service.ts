import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {RolePermissionsMxService} from "../role/rolePermissionsMx/rolePermissionsMx.service";
import {IRolePermissionMxJoinPermissions} from "../role/rolePermissionsMx/rolePermissionsMx.entity";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {Cache} from 'cache-manager';

@Injectable()
export class UserPermissionsService {

    private userId: number;
    private roleIds: number[];
    private rolePermissionsMap: Map<string, IRolePermissionMxJoinPermissions>;

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly mysqldbAls: MysqldbAls,
        private readonly rolePermissionsMxService: RolePermissionsMxService
    ) {
    }

    //服务初始化
    public async init(userId: number, roleIds: number[]): Promise<UserPermissionsService> {
        this.userId = userId;
        this.roleIds = roleIds;
        this.rolePermissionsMap = (await this.cacheManager.get(String(this.userId))) || new Map<string, IRolePermissionMxJoinPermissions>();

        if (this.rolePermissionsMap && this.rolePermissionsMap.size > 0) {
            //权限缓存已存在
            return this
        } else {
            //初始化
            await this.initRolePermissionsMap();
            await this.setCache();
            return this
        }
    }

    //初始化权限Map
    private async initRolePermissionsMap(): Promise<void> {
        if (this.roleIds.length === 0) return Promise.reject(new Error('初始化角色权限失败,缺少角色'));
        return await this.mysqldbAls.sqlTransaction(async () => {
            for (let i = 0; i < this.roleIds.length; i++) {
                const roleId = this.roleIds[i];
                const rolePermissionsMxList = await this.rolePermissionsMxService.findByRoleId(roleId);

                for (let j = 0; j < rolePermissionsMxList.length; j++) {
                    const rolePermissions = rolePermissionsMxList[j];
                    this.rolePermissionsMap.set(rolePermissions.permissionsCode, rolePermissions)
                }
            }
        })
    }

    //设置缓存
    private async setCache() {
        await this.cacheManager.set(String(this.userId), this.rolePermissionsMap)
    }

    //判断是否有权限可以执行
    public can(permissionCode: string): boolean {
        const permissions = this.rolePermissionsMap.get(permissionCode)
        return !!(permissions && permissions.permissionsCode === permissionCode && permissions.can);
    }

}