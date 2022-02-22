import { Body, Controller, Post } from "@nestjs/common";
import { FindOutboundMxDto } from "./dto/findOutboundMx.dto";
import { Outbound_mxService } from "./outbound_mx.service";

@Controller("erp/outbound_mx")
export class Outbound_mxController {
  constructor(private readonly outboundMxService: Outbound_mxService) {
  }

  //查询出仓单明细
  @Post("find")
  public async find(@Body() findDto: FindOutboundMxDto) {
    const data = await this.outboundMxService.find(findDto.outboundid);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }
}