import { Body, Controller, Post } from "@nestjs/common";
import { AddProductAreaDto } from "./dto/addProductArea.dto";
import { UpdateProductAreaDto } from "./dto/updateProductArea.dto";
import { DeleteProductAreaDto } from "./dto/deleteProductArea.dto";
import { ProductAreaService } from "./productArea.service";
import { ReqState } from "../../decorator/user.decorator";
import { State } from "../../interface/IState";


@Controller("erp/productArea")
export class ProductAreaController {

  constructor(private readonly productAreaService: ProductAreaService) {
  }

  @Post("select")
  async select() {
    const data = await this.productAreaService.select();
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("unselect")
  async unselect() {
    const data = await this.productAreaService.unselect();
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("add")
  async add(@Body() addDto: AddProductAreaDto, @ReqState() state:State) {
    addDto.creater = state.user.username;
    addDto.createdAt = new Date();
    await this.productAreaService.add(addDto);
    return {
      code: 200,
      msg: "保存成功"
    };
  }

  @Post("update")
  async update(@Body() updateDto: UpdateProductAreaDto, @ReqState() state:State) {
    updateDto.updater = state.user.username;
    updateDto.updatedAt = new Date();
    await this.productAreaService.update(updateDto);
    return {
      code: 200,
      msg: "更新成功"
    };
  }

  @Post("delete")
  async delete_data(@Body() deleteDto: DeleteProductAreaDto, @ReqState() state:State) {
    await this.productAreaService.delete_data(deleteDto,state);
    return {
      code: 200,
      msg: "删除成功"
    };
  }

  @Post("undelete")
  async undelete(@Body() deleteDto: DeleteProductAreaDto) {
    await this.productAreaService.undelete(deleteDto);
    return {
      code: 200,
      msg: "取消删除成功"
    };
  }
}
