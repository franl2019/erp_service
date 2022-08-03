import { Body, Controller, Post } from "@nestjs/common";
import { AddClientAreaDto } from "./dto/addClientArea.dto";
import { UpdateClientAreaDto } from "./dto/updateClientArea.dto";
import { DeleteClientAreaDto } from "./dto/deleteClientArea.dto";
import { ClientAreaService } from "./clientArea.service";
import {ReqState, IState} from "../../decorator/user.decorator";


@Controller("erp/clientArea")
export class ClientAreaController {

  constructor(private readonly clientAreaService: ClientAreaService) {
  }

  @Post("find")
  public async find() {
    const data = await this.clientAreaService.find();
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("create")
  public async add(@Body() addDto: AddClientAreaDto, @ReqState() state:IState) {
    addDto.creater = state.user.username;
    addDto.createdAt = new Date();
    await this.clientAreaService.create(addDto);
    return {
      code: 200,
      msg: "保存成功"
    };
  }

  @Post("update")
  public async update(@Body() updateDto: UpdateClientAreaDto, @ReqState() state:IState) {
    updateDto.updater = state.user.username;
    updateDto.updatedAt = new Date();
    await this.clientAreaService.update(updateDto);
    return {
      code: 200,
      msg: "更新成功"
    };
  }

  @Post("delete")
  public async delete_data(@Body() deleteDto: DeleteClientAreaDto, @ReqState() state:IState) {
    await this.clientAreaService.delete_data(deleteDto.clientareaid,state.user.username);
    return {
      code: 200,
      msg: "删除成功"
    };
  }
}
