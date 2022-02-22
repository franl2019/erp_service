import { Body, Controller, Post } from "@nestjs/common";
import { ReqState } from "../../decorator/user.decorator";
import { State } from "../../interface/IState";
import { ProductService } from "./product.service";
import { SelectProductDto } from "./dto/selectProduct.dto";
import { AddProductDto } from "./dto/addProduct.dto";
import { UpdateProductDto } from "./dto/updateProduct.dto";
import { DeleteProductDto } from "./dto/deleteProduct.dto";
import { L1ReviewProductDto } from "./dto/l1ReviewProduct.dto";
import { L2ReviewProductDto } from "./dto/l2ReviewProduct.dto";



@Controller("erp/product")
export class ProductController {

  constructor(
    private readonly productService: ProductService,
  ) {
  }

  @Post("select")
  async select(@Body() selectClientDto: SelectProductDto, @ReqState() state: State) {
    const data = await this.productService.select(selectClientDto,state);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("unselect")
  async unselect(@Body() selectClientDto: SelectProductDto, @ReqState() state: State) {
    const data = await this.productService.unselect(selectClientDto,state);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("add")
  async add(@Body() addDto: AddProductDto, @ReqState() state: State) {
    await this.productService.add(addDto,state);
    return {
      code: 200,
      msg: "保存成功"
    };
  }

  @Post("update")
  async update(@Body() updateDto: UpdateProductDto, @ReqState() state: State) {
    await this.productService.update(updateDto,state);
    return {
      code: 200,
      msg: "更新成功"
    };
  }

  @Post("delete")
  async delete_data(@Body() deleteDto: DeleteProductDto, @ReqState() state: State) {
    await this.productService.delete_data(deleteDto,state);
    return {
      code: 200,
      msg: "删除成功"
    };
  }

  @Post("undelete")
  async undelete(@Body() deleteDto: DeleteProductDto, @ReqState() state: State) {
    await this.productService.undelete(deleteDto,state);
    return {
      code: 200,
      msg: "取消删除成功"
    };
  }

  @Post("level1Review")
  async level1Review(@Body() l1reviewDto: L1ReviewProductDto, @ReqState() state: State) {
    const msg = await this.productService.level1Review(l1reviewDto,state);
    return {
      code: 200,
      msg
    };
  }

  @Post("level2Review")
  async level2Review(@Body() l2reviewDto: L2ReviewProductDto, @ReqState() state: State) {
    const msg = await this.productService.level2Review(l2reviewDto,state);
    return {
      code: 200,
      msg
    };
  }
}
