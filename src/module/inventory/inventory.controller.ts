import { Body, Controller, Post } from "@nestjs/common";

import { InventoryService } from "./inventory.service";
import { FindInventoryDto } from "./dto/findInventory.dto";
import { ReqState } from "../../decorator/user.decorator";
import { State } from "../../interface/IState";

@Controller("erp/inventory")
export class InventoryController {

  constructor(private readonly inventoryService: InventoryService) {
  }

  @Post("select")
  public async find(@Body() selectDto: FindInventoryDto, @ReqState() state: State) {
    if (selectDto.warehouseids.length === 0) {
      selectDto.warehouseids = state.user.warehouseids;
    }

    if (selectDto.operateareaids.length === 0) {
      selectDto.operateareaids = state.user.client_operateareaids;
    }

    const data = await this.inventoryService.find(selectDto);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }
}