import { Body, Controller, Post } from "@nestjs/common";
import { ReqState } from "../../decorator/user.decorator";
import { State } from "../../interface/IState";
import { CurrencyService } from "./currency.service";
import { AddCurrencyDto } from "./dto/addCurrency.dto";
import { UpdateCurrencyDto } from "./dto/updateCurrency.dto";
import { DeleteCurrencyDto } from "./dto/deleteCurrency.dto";


@Controller("erp/currency")
export class CurrencyController {

  constructor(private readonly currencyService: CurrencyService) {
  }

  @Post("select")
  async select() {
    const data = await this.currencyService.select();
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("unselect")
  async unselect() {
    const data = await this.currencyService.unSelect();
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("add")
  async add(@Body() addDto: AddCurrencyDto, @ReqState() state: State) {
    addDto.creater = state.user.username;
    addDto.createdAt = new Date();
    await this.currencyService.add(addDto);
    return {
      code: 200,
      msg: "保存成功"
    };
  }

  @Post("update")
  async update(@Body() updateDto: UpdateCurrencyDto, @ReqState() state: State) {
    updateDto.updater = state.user.username;
    updateDto.updatedAt = new Date();
    await this.currencyService.update(updateDto);
    return {
      code: 200,
      msg: "更新成功"
    };
  }

  @Post("delete_data")
  async delete_data(@Body() deleteDto: DeleteCurrencyDto, @ReqState() state: State) {
    await this.currencyService.delete_data(deleteDto,state.user.username);
    return {
      code: 200,
      msg: "删除成功"
    };
  }

  @Post("unDelete_data")
  async unDelete_data(@Body() deleteDto: DeleteCurrencyDto) {
    await this.currencyService.undelete(deleteDto);
    return {
      code: 200,
      msg: "取消删除成功"
    };
  }
}
