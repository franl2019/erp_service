import { Injectable } from "@nestjs/common";
import { Inbound_mxEntity } from "./inbound_mx.entity";
import { InboundMxDto } from "./dto/inboundMx.dto";
import { verifyParam } from "../../utils/verifyParam";
import { IInbound_mx } from "./inbound_mx";

@Injectable()
export class Inbound_mxService {

  constructor(private readonly inbound_mxSql: Inbound_mxEntity) {
  }

  public async find(inboundid: number){
    return await this.inbound_mxSql.find(inboundid);
  }

  public async find_entity(inboundid: number) {
    return await this.inbound_mxSql.find_entity(inboundid);
  }

  //新增进仓单的明细
  public async create(inboundMxList: IInbound_mx[]) {
    //验证后的List
    const verifiedInboundMxList: IInbound_mx[] = [];
    for (let i = 0; i < inboundMxList.length; i++) {
      const inboundMx = new InboundMxDto(inboundMxList[i]);
      //验证进仓单的明细参数
      await verifyParam(inboundMx);
      if(inboundMx.clientid === 0){
        return Promise.reject(new Error('进仓单的明细，缺少客户'))
      }
      verifiedInboundMxList.push(inboundMx);
    }
    return await this.inbound_mxSql.create(verifiedInboundMxList);
  }

  //删除进仓单的明细
  public async delete_date(inboundid: number) {
    return await this.inbound_mxSql.delete_data(inboundid);
  }
}