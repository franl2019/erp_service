import { Body, Controller, Post } from "@nestjs/common";
import { AddBuyDto } from "./dto/addBuy.dto";
import { UpdateBuyDto } from "./dto/updateBuy.dto";
import { DeleteBuyDto } from "./dto/deleteBuy.dto";
import { BuyService } from "./buy.service";
import { ReqState } from "../../decorator/user.decorator";
import { State } from "../../interface/IState";
import { SelectBuyDto } from "./dto/selectBuy.dto";
import { L1reviewBuyDto } from "./dto/l1reviewBuy.dto";
import { L2reviewDto } from "./dto/l2review.dto";


@Controller("erp/buy")
export class BuyController {

  constructor(
    private readonly buyService: BuyService,
  ) {
  }

  @Post("select")
  async select(@Body() selectBuyDto: SelectBuyDto, @ReqState() state: State) {
    const data = await this.buyService.select(selectBuyDto,state);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("unselect")
  async unselect(@Body() selectBuyDto: SelectBuyDto, @ReqState() state: State) {
    const data = await this.buyService.unselect(selectBuyDto,state);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("add")
  async add(@Body() addDto: AddBuyDto, @ReqState() state: State) {
    await this.buyService.add(addDto,state);
    return {
      code: 200,
      msg: "保存成功"
    };
  }

  @Post("update")
  async update(@Body() updateDto: UpdateBuyDto, @ReqState() state: State) {
    await this.buyService.update(updateDto,state);
    return {
      code: 200,
      msg: "更新成功"
    };
  }

  @Post("delete")
  async delete(@Body() deleteDto: DeleteBuyDto, @ReqState() state: State) {
    await this.buyService.delete_data(deleteDto,state);
    return {
      code: 200,
      msg: "删除成功"
    };
  }

  @Post("undelete")
  async undelete(@Body() deleteDto: DeleteBuyDto, @ReqState() state: State) {
    await this.buyService.undelete(deleteDto,state);
    return {
      code: 200,
      msg: "取消删除成功"
    };
  }

  @Post("level1Review")
  async level1Review(@Body() l1reviewDto: L1reviewBuyDto, @ReqState() state: State) {
    const msg = await this.buyService.level1Review(l1reviewDto,state);
    return {
      code: 200,
      msg
    };
  }

  @Post("level2Review")
  async level2Review(@Body() l2reviewDto: L2reviewDto, @ReqState() state: State) {
    const msg = await this.buyService.level2Review(l2reviewDto,state);
    return {
      code: 200,
      msg
    };
  }
}
