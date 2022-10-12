import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {IState} from "../decorator/user.decorator";
import {UserRolePermissionsService} from "../module/userRoleMx/userRolePermissions.service";

export function permissionFactoryGuard(permissionsName: string): any {

    @Injectable()
    class PermissionsGuard implements CanActivate {

        constructor(
            protected readonly userRolePermissionsService: UserRolePermissionsService
        ) {
        }

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const roleIds = context.switchToHttp().getRequest<{state:IState}>().state.user.roleIds;
            return (await this.userRolePermissionsService.init(roleIds)).can(permissionsName)
        }
    }

    return PermissionsGuard
}