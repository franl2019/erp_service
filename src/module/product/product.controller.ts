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
  public async find(@Body() selectClientDto: SelectProductDto, @ReqState() state: State) {
    const data = await this.productService.find(selectClientDto,state);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("add")
 public async create(@Body() addDto: AddProductDto, @ReqState() state: State) {
    await this.productService.create(addDto,state);
    return {
      code: 200,
      msg: "保存成功"
    };
  }

  @Post("update")
  public async update(@Body() updateDto: UpdateProductDto, @ReqState() state: State) {
    await this.productService.update(updateDto,state);
    return {
      code: 200,
      msg: "更新成功"
    };
  }

  @Post("delete")
  public async delete_data(@Body() deleteDto: DeleteProductDto, @ReqState() state: State) {
    await this.productService.delete_data(deleteDto.productid,state);
    return {
      code: 200,
      msg: "删除成功"
    };
  }

  @Post("level1Review")
  async level1Review(@Body() l1reviewDto: L1ReviewProductDto, @ReqState() state: State) {
    await this.productService.l1Review(l1reviewDto.productid,state.user.username);
    return {
      code: 200,
      msg:'审核成功'
    };
  }

  @Post("unLevel1Review")
  async unLevel1Review(@Body() l1reviewDto: L1ReviewProductDto) {
    await this.productService.unl1Review(l1reviewDto.productid);
    return {
      code: 200,
      msg:'撤审成功'
    };
  }

  @Post("level2Review")
  async level2Review(@Body() l2reviewDto: L2ReviewProductDto, @ReqState() state: State) {
    await this.productService.l2Review(l2reviewDto.productid,state.user.username);
    return {
      code: 200,
      msg:'财审成功'
    };
  }

  @Post("unLevel2Review")
  async unLevel2Review(@Body() l2reviewDto: L2ReviewProductDto) {
    await this.productService.unl2Review(l2reviewDto.productid);
    return {
      code: 200,
      msg:'财审撤销成功'
    };
  }
}
