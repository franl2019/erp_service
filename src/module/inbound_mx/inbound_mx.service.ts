import { Injectable } from "@nestjs/common";
import { InboundMxEntity } from "./inbound_mx.entity";
import { InboundMxDto } from "./dto/inboundMx.dto";
import { verifyParam } from "../../utils/verifyParam";
import { IInboundMx } from "./inbound_mx";

@Injectable()
export class Inbound_mxService {

  constructor(private readonly inboundMxEntity: InboundMxEntity) {
  }

  public async find(inboundid: number){
    return await this.inboundMxEntity.find(inboundid);
  }

  public async findById(inboundid: number) {
    return await this.inboundMxEntity.findById(inboundid);
  }

  //新增进仓单的明细
  public async create(inboundMxList: IInboundMx[]) {
    //验证后的List
    const verifiedInboundMxList: IInboundMx[] = [];
    for (let i = 0; i < inboundMxList.length; i++) {
      const inboundMx = new InboundMxDto(inboundMxList[i]);
      //验证进仓单的明细参数
      await verifyParam(inboundMx);
      if(inboundMx.clientid === 0){
        return Promise.reject(new Error('进仓单的明细，缺少客户'))
      }
      verifiedInboundMxList.push(inboundMx);
    }
    return await this.inboundMxEntity.create(verifiedInboundMxList);
  }

  //删除进仓单的明细
  public async delete_date(inboundid: number) {
    return await this.inboundMxEntity.delete_data(inboundid);
  }
}