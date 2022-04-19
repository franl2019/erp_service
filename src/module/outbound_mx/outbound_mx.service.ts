import { Injectable } from "@nestjs/common";
import { Outbound_mxEntity } from "./outbound_mx.entity";
import { IOutboundMx } from "./outbound_mx";
import { CreateOutboundDto } from "./dto/createOutbound.dto";
import { verifyParam } from "../../utils/verifyParam";

@Injectable()
export class Outbound_mxService {

  constructor(
    private readonly outbound_mxEntity: Outbound_mxEntity
  ) {
  }

  //查询出仓单明细
  public async find(outboundid: number) {
    return await this.outbound_mxEntity.find(outboundid);
  }

  //查询出仓单明细_实例
  public async findById(outboundid: number) {
    return await this.outbound_mxEntity.find_entity(outboundid);
  }

  //增加出仓单明细
  public async create(outboundMxList: IOutboundMx[]) {
    const verifiedOutboundMxList:IOutboundMx[] = [];
    //验证出仓单明细参数是否正确
    for (let i = 0; i < outboundMxList.length; i++) {
      const outboundMx = new CreateOutboundDto(outboundMxList[i]);
      //验证
      await verifyParam(outboundMx);
      verifiedOutboundMxList.push(outboundMx);
    }
    return await this.outbound_mxEntity.create(verifiedOutboundMxList);
  }

  //删除出仓单明细
  public async delete_data(outboundid: number) {
    return await this.outbound_mxEntity.delete_data(outboundid);
  }
}