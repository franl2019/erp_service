import { Body, Controller, Post } from "@nestjs/common";
import { Inbound_mxService } from "./inbound_mx.service";
import { findInboundMxDto } from "./dto/findInboundMx.dto";

@Controller("erp/inboundmx/")
export class Inbound_mxController {

  constructor(private readonly inbound_mxService: Inbound_mxService) {
  }

  @Post("select")
  public async select(@Body() findDto: findInboundMxDto) {
    const data = await this.inbound_mxService.find(findDto.inboundid);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }
}