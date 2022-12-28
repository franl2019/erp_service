import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {IState} from "../decorator/user.decorator";
import {UserPermissionsService} from "../module/userPermissions/userPermissions.service";

export function permissionFactoryGuard(permissionsCode: string): any {

    @Injectable()
    class PermissionsGuard implements CanActivate {

        constructor(
            protected readonly userRolePermissionsService: UserPermissionsService
        ) {
        }

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const state = context.switchToHttp().getRequest<{ state: IState }>().state;
            const roleIds = state.user.roleIds;
            const userId = state.user.userid;
            const userRolePermissionsService = await this.userRolePermissionsService.init(userId, roleIds);
            const canExecute = userRolePermissionsService.can(permissionsCode);
            if (canExecute) {
                return true
            } else {
                return Promise.reject(new Error('缺少权限'))
            }
        }
    }

    return PermissionsGuard
}