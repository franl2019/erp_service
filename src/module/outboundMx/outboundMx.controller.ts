import { Body, Controller, Post } from "@nestjs/common";
import { FindOutboundMxDto } from "./dto/findOutboundMx.dto";
import { OutboundMxService } from "./outboundMx.service";

@Controller("erp/outbound_mx")
export class OutboundMxController {
  constructor(private readonly outboundMxService: OutboundMxService) {
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