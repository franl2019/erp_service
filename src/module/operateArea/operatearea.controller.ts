import { Body, Controller, Post } from "@nestjs/common";
import { AddOperateAreaDto } from "./dto/addOperateArea.dto";
import { UpdateOperateAreaDto } from "./dto/updateOperateArea.dto";
import { DeleteOperateAreaDto } from "./dto/deleteOperateArea.dto";
import { OperateareaService } from "./operatearea.service";
import {ReqState, IState} from "../../decorator/user.decorator";
import { SelectOperateAreaDto } from "./dto/selectOperateArea.dto";

@Controller("erp/operateArea")
export class OperateareaController {

  constructor(private readonly operateareaService: OperateareaService) {
  }

  @Post("select")
  async select(@Body() select:SelectOperateAreaDto) {
    const data = await this.operateareaService.select(select);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("findDefaultOperatearea")
  async findDefaultOperatearea(@Body() select:SelectOperateAreaDto) {
    const data = await this.operateareaService.findDefaultOperateArea(select.operateareatype);
    return {
      code: 200,
      msg: "查询成功",
      data:[data]
    };
  }

  @Post("unselect")
  async unselect() {
    const data = await this.operateareaService.unselect();
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("add")
  async add(@Body() addDto: AddOperateAreaDto,@ReqState() state:IState) {
    addDto.creater = state.user.username;
    addDto.createdAt = new Date();
    await this.operateareaService.add(addDto);
    return {
      code: 200,
      msg: "保存成功"
    };
  }

  @Post("update")
  async update(@Body() updateDto: UpdateOperateAreaDto,@ReqState() state:IState) {
    updateDto.updater = state.user.username
    updateDto.updatedAt = new Date();
    await this.operateareaService.update(updateDto);
    return {
      code: 200,
      msg: "更新成功"
    };
  }

  @Post("delete")
  async delete_data(@Body() deleteDto: DeleteOperateAreaDto,@ReqState() state:IState) {
    deleteDto.del_uuid = deleteDto.operateareaid;
    deleteDto.deletedAt = new Date();
    deleteDto.deleter = state.user.username;
    await this.operateareaService.delete_data(deleteDto);
    return {
      code: 200,
      msg: "删除成功"
    };
  }

  @Post("undelete")
  async undelete(@Body() deleteDto: DeleteOperateAreaDto) {
    await this.operateareaService.undelete(deleteDto);
    return {
      code: 200,
      msg: "取消删除成功"
    };
  }
}
