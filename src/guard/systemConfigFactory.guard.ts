import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {SystemConfigService} from "../module/systemConfig/systemConfig.service";
import {IState} from "../decorator/user.decorator";

export function systemConfigFactoryGuard(systemConfigOptionId: number, systemConfigOptionMxId: number): any {

    @Injectable()
    class SystemConfigGuard implements CanActivate {

        constructor(
            protected readonly systemConfigService: SystemConfigService
        ) {
        }

        async canActivate(
            context: ExecutionContext,
        ): Promise<boolean> {
            const systemConfigHeadId = context.switchToHttp().getRequest<{ state: IState }>().state.user.systemConfigHeadId
            const isCan = await this.systemConfigService.can(systemConfigHeadId, systemConfigOptionId, systemConfigOptionMxId);
            if (isCan) {
                return true
            } else {
                return Promise.reject(new Error(`当前账套不能执行此服务(#${systemConfigOptionId})`))
            }
        }
    }

    return SystemConfigGuard
}