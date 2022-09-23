import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "../module/user/user.service";
import { UserOperateAreaMxService } from "../module/userOperateAreaMx/userOperateAreaMx.service";
import { SelectUserOperateAreaMxDto } from "../module/userOperateAreaMx/dto/selectUserOperateAreaMx.dto";
import { SelectUserWarehouseMxDto } from "../module/userWarehouseMx/dto/selectUserWarehouseMx.dto";
import { UserWarehouseMxService } from "../module/userWarehouseMx/userWarehouseMx.service";
import {UserAccountAuthFindDto} from "../module/userAccountMx/dto/userAccountAuthFind.dto";
import {UserAccountMxService} from "../module/userAccountMx/userAccountMx.service";
import {IState} from "../decorator/user.decorator";


@Injectable()
export class UserInfoInterceptor implements NestInterceptor {
  constructor(
    private readonly userService: UserService,
    private readonly userOperateAreaMxService: UserOperateAreaMxService,
    private readonly userWarehouseMxService: UserWarehouseMxService,
    private readonly userAccountMxService:UserAccountMxService
  ) {
  }

  async intercept(context: ExecutionContext, next: CallHandler<{state:IState}>): Promise<Observable<{state:IState}>> {
    const req = context.switchToHttp().getRequest<{state:IState}>();
    if (req.state) {
      const userid = req.state.token.userid;
      const user = await this.userService.findById(userid);

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
      let accountIds:number[] = [];
      if(userAccountAuthList.length>0){
        accountIds = userAccountAuthList.map( userAccountAuth => userAccountAuth.accountId)
      }


      req.state = {
        token: {
          userid
        },
        user: {
          userid: user.userid,
          username: user.username,
          systemConfigHeadId:user.systemConfigHeadId,
          buy_operateareaids: buyOperateArea,
          client_operateareaids: clientOperateArea,
          warehouseids,
          accountIds
        }
      };
    }
    return next.handle();
  }
}