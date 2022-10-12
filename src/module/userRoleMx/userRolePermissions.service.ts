import {Injectable, Scope} from "@nestjs/common";
import {RolePermissionsMxService} from "../role/rolePermissionsMx/rolePermissionsMx.service";
import {IRolePermissionMxAndPermissions} from "../role/rolePermissionsMx/rolePermissionsMx.entity";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable({scope: Scope.REQUEST})
export class UserRolePermissionsService {

    private rolePermissionsMap: Map<string, IRolePermissionMxAndPermissions>

    constructor(
        private readonly mysqldbAls:MysqldbAls,
        private readonly rolePermissionsMxService: RolePermissionsMxService
    ) {
    }

    public async init(roleIds: number[]): Promise<UserRolePermissionsService> {
        if (this.rolePermissionsMap.size !== 0) {
            console.log('已经初始化')
            return this
        }

        await this.initRolePermissionsMap(roleIds);
        console.log('初始化')
        return this
    }

    private async initRolePermissionsMap(roleIds: number[]): Promise<void> {
        if(roleIds.length === 0) return Promise.reject(new Error('初始化角色权限失败,缺少角色'));

        return await this.mysqldbAls.sqlTransaction(async ()=>{
            for (let i = 0; i < roleIds.length; i++) {
                const roleId = roleIds[i];
                const rolePermissionsMxList = await this.rolePermissionsMxService.findAll(roleId);

                for (let j = 0; j < rolePermissionsMxList.length; j++) {
                    const rolePermissions = rolePermissionsMxList[j];
                    this.rolePermissionsMap.set(rolePermissions.permissionsName, rolePermissions)
                }
            }
        })
    }

    public can(permissionName: string): boolean {
        const permissions = this.rolePermissionsMap.get(permissionName)
        return permissions.permissionsName === permissionName;
    }

}