import { Body, Controller, Post, Request } from "@nestjs/common";
import { ReqState } from "../../decorator/user.decorator";
import { State } from "../../interface/IState";
import { UserWarehouseMxService } from "./userWarehouseMx.service";

import { AddUserWarehouseMxDto } from "./dto/addUserWarehouseMx.dto";
import { DeleteUserWarehouseMxDto } from "./dto/deleteUserWarehouseMx.dto";
import { SelectUserWarehouseMxDto } from "./dto/selectUserWarehouseMx.dto";

@Controller("erp/user_warehouse_mx")
export class UserWarehouseMxController {

  constructor(private readonly userWarehouseMxService:UserWarehouseMxService) {
  }

  @Post("select")
  async select(@Body() selectDto: SelectUserWarehouseMxDto) {
    const data = await this.userWarehouseMxService.select(selectDto);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("findInfo")
  async findAll(@Body() selectDto: SelectUserWarehouseMxDto) {
    const data = await this.userWarehouseMxService.findAll(selectDto);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("add")
  async add(@Body() addDto: AddUserWarehouseMxDto, @Request() req: Request,@ReqState() state:State) {
    addDto.creater = state.user.username;
    addDto.createdAt = new Date();
    await this.userWarehouseMxService.add(addDto);
    return {
      code: 200,
      msg: "保存成功"
    };
  }


  @Post("delete")
  async delete_data(@Body() deleteDto: DeleteUserWarehouseMxDto) {
    await this.userWarehouseMxService.delete_data(deleteDto);
    return {
      code: 200,
      msg: "删除成功"
    };
  }
}