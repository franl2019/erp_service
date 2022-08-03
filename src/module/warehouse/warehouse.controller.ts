import { Body, Controller, Post } from "@nestjs/common";
import { AddWarehouseDto } from "./dto/addWarehouse.dto";
import { UpdateWarehouseDto } from "./dto/updateWarehouse.dto";
import { DeleteWarehouseDto } from "./dto/deleteWarehouse.dto";
import { WarehouseService } from "./warehouse.service";
import {ReqState, IState} from "../../decorator/user.decorator";
import { SelectWarehouse_authDto } from "./dto/selectWarehouse_auth.dto";

@Controller("erp/warehouse")
export class WarehouseController {

  constructor(private readonly warehouseService: WarehouseService) {
  }

  @Post("select")
  async select() {
    const data = await this.warehouseService.select();
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("select_auth")
  async select_auth(@Body() selectAuthDto: SelectWarehouse_authDto, @ReqState() state: IState) {
    selectAuthDto.userid = state.user.userid;
    const data = await this.warehouseService.select_auth(selectAuthDto);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("select_auth_default")
  async select_auth_default(@Body() selectAuthDto: SelectWarehouse_authDto, @ReqState() state: IState) {
    selectAuthDto.userid = state.user.userid;
    const data = await this.warehouseService.getWarehouseAuthDefault(selectAuthDto);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("unselect")
  async unselect() {
    const data = await this.warehouseService.unselect();
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("add")
  async add(@Body() addDto: AddWarehouseDto, @ReqState() state: IState) {
    addDto.creater = state.user.username;
    addDto.createdAt = new Date();
    await this.warehouseService.add(addDto);
    return {
      code: 200,
      msg: "保存成功"
    };
  }

  @Post("update")
  async update(@Body() updateDto: UpdateWarehouseDto, @ReqState() state: IState) {
    updateDto.updater = state.user.username;
    updateDto.updatedAt = new Date();
    await this.warehouseService.update(updateDto);
    return {
      code: 200,
      msg: "更新成功"
    };
  }

  @Post("delete")
  async delete_data(@Body() deleteDto: DeleteWarehouseDto, @ReqState() state: IState) {
    await this.warehouseService.delete_data(deleteDto, state);
    return {
      code: 200,
      msg: "删除成功"
    };
  }

  @Post("undelete")
  async undelete(@Body() deleteDto: DeleteWarehouseDto) {
    await this.warehouseService.undelete(deleteDto);
    return {
      code: 200,
      msg: "取消删除成功"
    };
  }
}
