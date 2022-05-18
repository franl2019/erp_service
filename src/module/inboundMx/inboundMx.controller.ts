import { Body, Controller, Post } from "@nestjs/common";
import { InboundMxService } from "./inboundMx.service";
import { findInboundMxDto } from "./dto/findInboundMx.dto";

@Controller("erp/inboundmx/")
export class InboundMxController {

  constructor(private readonly inbound_mxService: InboundMxService) {
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