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
    const data = await this.clientService.find(selectClientDto, state);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("selectGsClient")
  async selectGsClient() {
    const data = await this.clientService.getGsClient();
    return {
      code: 200,
      msg: "查询成功",
      data: [data]
    };
  }

  @Post("add")
  async create(@Body() addDto: AddClientDto, @ReqState() state: State) {
    await this.clientService.create(addDto, state);
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

  @Post("level1Review")
  async level1Review(@Body() l1reviewDto: L1reviewClientDto, @ReqState() state: State) {
    await this.clientService.level1Review(l1reviewDto.clientid, state.user.username);
    return {
      code: 200,
      msg:'审核成功'
    };
  }

  @Post("unLevel1Review")
  async unLevel1Review(@Body() l1reviewDto: L1reviewClientDto, @ReqState() state: State) {
    await this.clientService.unLevel1Review(l1reviewDto.clientid);
    return {
      code: 200,
      msg:'审核撤销成功'
    };
  }

  @Post("level2Review")
  async level2Review(@Body() l2reviewDto: L2reviewClientDto, @ReqState() state: State) {
    await this.clientService.level2Review(l2reviewDto.clientid, state.user.username);
    return {
      code: 200,
      msg:'财务审核成功'
    };
  }

  @Post("unLevel2Review")
  async unLevel2Review(@Body() l2reviewDto: L2reviewClientDto, @ReqState() state: State) {
    await this.clientService.unLevel2Review(l2reviewDto.clientid);
    return {
      code: 200,
      msg:'财务审核撤销成功'
    };
  }
}
