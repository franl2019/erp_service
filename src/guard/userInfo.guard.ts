import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {UserService} from "../module/user/user.service";
import {UserOperateAreaMxService} from "../module/userOperateAreaMx/userOperateAreaMx.service";
import {UserWarehouseMxService} from "../module/userWarehouseMx/userWarehouseMx.service";
import {UserAccountMxService} from "../module/userAccountMx/userAccountMx.service";
import {IState} from "../decorator/user.decorator";
import {SelectUserOperateAreaMxDto} from "../module/userOperateAreaMx/dto/selectUserOperateAreaMx.dto";
import {SelectUserWarehouseMxDto} from "../module/userWarehouseMx/dto/selectUserWarehouseMx.dto";
import {UserAccountAuthFindDto} from "../module/userAccountMx/dto/userAccountAuthFind.dto";

@Injectable()
export class UserInfoGuard implements CanActivate {

    constructor(
        private readonly userService: UserService,
        private readonly userOperateAreaMxService: UserOperateAreaMxService,
        private readonly userWarehouseMxService: UserWarehouseMxService,
        private readonly userAccountMxService: UserAccountMxService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest<{ state: IState }>();
        const userid = request.state.token.userid
        if (userid!==0) {

            const user = await this.userService.findById(userid);

            if(user.systemConfigHeadId === 0){
                return Promise.reject(new Error('用户还未设置账套,请联系管理员设置'))
            }

            //获取权限
            //操作区域权限
            const clientSelectDto = new SelectUserOperateAreaMxDto();
            clientSelectDto.userid = userid;
            clientSelectDto.operateareatype = 0;
            const clientOperateArea = await this.userOperateAreaMxService.findUserOperaAreaIdList(clientSelectDto);

            //供应商操作区域
            const buySelectDto = new SelectUserOperateAreaMxDto();
            buySelectDto.userid = userid;
            buySelectDto.operateareatype = 1;
            const buyOperateArea = await this.userOperateAreaMxService.findUserOperaAreaIdList(buySelectDto);

            //仓库权限
            const warehouseSelectDto = new SelectUserWarehouseMxDto();
            warehouseSelectDto.userid = userid;
            const warehouseids = await this.userWarehouseMxService.select(warehouseSelectDto);

            const userAccountAuthFindDto = new UserAccountAuthFindDto();
            userAccountAuthFindDto.userid = userid;
            userAccountAuthFindDto.accountId = 0;

            const userAccountAuthList = await this.userAccountMxService.find(userAccountAuthFindDto);
            let accountIds: number[] = [];
            if (userAccountAuthList.length > 0) {
                accountIds = userAccountAuthList.map(userAccountAuth => userAccountAuth.accountId)
            }


            request.state = {
                token: {
                    userid
                },
                user: {
                    userid: user.userid,
                    username: user.username,
                    systemConfigHeadId: user.systemConfigHeadId,
                    buy_operateareaids: buyOperateArea,
                    client_operateareaids: clientOperateArea,
                    warehouseids,
                    accountIds
                }
            };


        }

        return true;
    }


}