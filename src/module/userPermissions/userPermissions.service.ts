import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {RolePermissionsMxService} from "../role/rolePermissionsMx/rolePermissionsMx.service";
import {IRolePermissionMxJoinPermissions} from "../role/rolePermissionsMx/rolePermissionsMx.entity";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {Cache} from 'cache-manager';

@Injectable()
export class UserPermissionsService {

    private userId: number;
    private roleIds: number[];
    private rolePermissionsMap: Map<number, IRolePermissionMxJoinPermissions> = new Map()

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly mysqldbAls: MysqldbAls,
        private readonly rolePermissionsMxService: RolePermissionsMxService
    ) {
    }

    public async init(userId: number, roleIds: number[]): Promise<UserPermissionsService> {
        this.userId = userId;
        this.roleIds = [...roleIds];
        const rolePermissionsMap: Map<number, IRolePermissionMxJoinPermissions> | undefined = await this.cacheManager.get(String(this.userId));
        console.log(rolePermissionsMap)
        if (rolePermissionsMap && rolePermissionsMap.size > 0) {
            console.log('已有初始化')
            this.rolePermissionsMap = rolePermissionsMap;
            return this
        } else {
            console.log('初始化')
            await this.initRolePermissionsMap();
            await this.setCache();
            return this
        }
    }

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

    private async setCache() {
        await this.cacheManager.set(String(this.userId), this.rolePermissionsMap)
    }

    public async clearCache(userId:number){
        await this.cacheManager.del(String(userId));
    }

    public can(permissionCode: number): boolean {
        const permissions = this.rolePermissionsMap.get(permissionCode)
        return !!(permissions && permissions.permissionsCode === permissionCode && permissions.can);
    }

}