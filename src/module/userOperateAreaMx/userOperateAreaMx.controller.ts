import { Body, Request, Controller, Post } from "@nestjs/common";
import { SelectUserOperateAreaMxDto } from "./dto/selectUserOperateAreaMx.dto";
import { AddUserOperateAreaMxDto } from "./dto/addUserOperateAreaMx.dto";
import { DeleteUserOperateAreaMxDto } from "./dto/deleteUserOperateAreaMx.dto";
import { UserOperateAreaMxService } from "./userOperateAreaMx.service";
import {ReqState, IState} from "../../decorator/user.decorator";


@Controller("erp/user_operatearea_mx")
export class UserOperateAreaMxController {

  constructor(private readonly userOperateAreaMxService: UserOperateAreaMxService) {
  }

  @Post("select")
  async select(@Body() selectDto: SelectUserOperateAreaMxDto) {
    const data = await this.userOperateAreaMxService.findUserOperaAreaIdList(selectDto);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("findInfo")
  async findInfo(@Body() selectDto: SelectUserOperateAreaMxDto) {
    const data = await this.userOperateAreaMxService.findUserOperaAreasInfoList(selectDto);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("findDefaultUserOperateArea")
  async findDefaultUserOperateArea(@ReqState() state:IState) {
    const data = await this.userOperateAreaMxService.findUserDefaultOperateArea(state);
    return {
      code: 200,
      msg: "查询成功",
      data:[data]
    };
  }

  @Post("add")
  async add(@Body() addDto: AddUserOperateAreaMxDto, @Request() req: Request, @ReqState() state: IState) {
    addDto.creater = state.user.username;
    addDto.createdAt = new Date();
    await this.userOperateAreaMxService.add(addDto);
    return {
      code: 200,
      msg: "保存成功"
    };
  }


  @Post("delete")
  async delete_data(@Body() deleteDto: DeleteUserOperateAreaMxDto) {
    await this.userOperateAreaMxService.delete_data(deleteDto);
    return {
      code: 200,
      msg: "删除成功"
    };
  }
}
