import { Body, Controller, Post } from "@nestjs/common";
import { AddBuyAreaDto } from "./dto/addBuyArea.dto";
import { UpdateBuyAreaDto } from "./dto/updateBuyArea.dto";
import { DeleteBuyAreaDto } from "./dto/deleteBuyArea.dto";
import { BuyAreaService } from "./buyArea.service";
import { ReqState } from "../../decorator/user.decorator";
import { State } from "../../interface/IState";


@Controller("erp/buyArea")
export class BuyAreaController {

  constructor(private readonly buyAreaService: BuyAreaService) {
  }

  @Post("select")
  async select() {
    const data = await this.buyAreaService.select();
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("unselect")
  async unselect() {
    const data = await this.buyAreaService.unselect();
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("add")
  async add(@Body() addDto: AddBuyAreaDto,@ReqState() state:State) {
    addDto.creater = state.user.username;
    addDto.createdAt = new Date();
    await this.buyAreaService.add(addDto);
    return {
      code: 200,
      msg: "保存成功"
    };
  }

  @Post("update")
  async update(@Body() updateDto: UpdateBuyAreaDto,@ReqState() state:State) {
    updateDto.updater = state.user.username;
    updateDto.updatedAt = new Date();
    await this.buyAreaService.update(updateDto);
    return {
      code: 200,
      msg: "更新成功"
    };
  }

  @Post("delete")
  async delete(@Body() deleteDto: DeleteBuyAreaDto,@ReqState() state:State) {
    deleteDto.del_uuid = deleteDto.buyareaid;
    deleteDto.deletedAt = new Date();
    deleteDto.deleter = state.user.username;
    await this.buyAreaService.delete_data(deleteDto);
    return {
      code: 200,
      msg: "删除成功"
    };
  }

  @Post("undelete")
  async undelete(@Body() deleteDto: DeleteBuyAreaDto) {
    await this.buyAreaService.undelete(deleteDto);
    return {
      code: 200,
      msg: "取消删除成功"
    };
  }
}
