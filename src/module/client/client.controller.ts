import { Body, Controller, Post } from "@nestjs/common";
import { AddClientDto } from "./dto/addClient.dto";
import { UpdateClientDto } from "./dto/updateClient.dto";
import { DeleteClientDto } from "./dto/deleteClient.dto";
import { ClientService } from "./client.service";
import { ReqState } from "../../decorator/user.decorator";
import { State } from "../../interface/IState";
import { SelectClientDto } from "./dto/selectClient.dto";
import { L1reviewClientDto } from "./dto/l1reviewClient.dto";
import { L2reviewClientDto } from "./dto/l2reviewClient.dto";


@Controller("erp/client")
export class ClientController {

  constructor(
    private readonly clientService: ClientService
  ) {
  }

  @Post("select")
  async select(@Body() selectClientDto: SelectClientDto, @ReqState() state: State) {
    const data = await this.clientService.select(selectClientDto, state);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("selectGsClient")
  async selectGsClient() {
    const data = await this.clientService.selectGsClient();
    return {
      code: 200,
      msg: "查询成功",
      data: [data]
    };
  }

  @Post("unselect")
  async unselect(@Body() selectClientDto: SelectClientDto, @ReqState() state: State) {
    const data = await this.clientService.unselect(selectClientDto, state);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("add")
  async add(@Body() addDto: AddClientDto, @ReqState() state: State) {
    await this.clientService.add(addDto, state);
    return {
      code: 200,
      msg: "保存成功"
    };
  }

  @Post("update")
  async update(@Body() updateDto: UpdateClientDto, @ReqState() state: State) {
    await this.clientService.update(updateDto, state);
    return {
      code: 200,
      msg: "更新成功"
    };
  }

  @Post("delete")
  async delete_data(@Body() deleteDto: DeleteClientDto, @ReqState() state: State) {
    await this.clientService.delete_data(deleteDto, state);
    return {
      code: 200,
      msg: "删除成功"
    };
  }

  @Post("undelete")
  async undelete(@Body() deleteDto: DeleteClientDto, @ReqState() state: State) {
    await this.clientService.undelete(deleteDto, state);
    return {
      code: 200,
      msg: "取消删除成功"
    };
  }

  @Post("level1Review")
  async level1Review(@Body() l1reviewDto: L1reviewClientDto, @ReqState() state: State) {
    const msg = await this.clientService.level1Review(l1reviewDto, state);
    return {
      code: 200,
      msg
    };
  }

  @Post("level2Review")
  async level2Review(@Body() l2reviewDto: L2reviewClientDto, @ReqState() state: State) {
    const msg = await this.clientService.level2Review(l2reviewDto, state);
    return {
      code: 200,
      msg
    };
  }
}
