import { IOutboundDto } from "./dto/outbound.dto";

export interface IOutbound {
  outboundid: number;
  outboundcode: string;
  outboundtype: number;
  outdate: Date;
  moneytype: string;
  relatednumber: string;
  remark1: string;
  remark2: string;
  remark3: string;
  remark4: string;
  remark5: string;
  printcount: number;
  level1review: number;
  level1name: string;
  level1date: Date;
  level2review: number;
  level2name: string;
  level2date: Date;
  creater: string;
  createdAt: Date;
  updater: string;
  updatedAt: Date;
  warehouseid: number;
  clientid: number;
  del_uuid: number;
  deletedAt: Date;
  deleter: string;
}

export class Outbound implements IOutbound {
  outboundid: number;
  outboundcode: string;
  outboundtype: number;
  outdate: Date;
  moneytype: string;
  relatednumber: string;
  remark1: string;
  remark2: string;
  remark3: string;
  remark4: string;
  remark5: string;
  printcount: number;
  level1review: number;
  level1name: string;
  level1date: Date;
  level2review: number;
  level2name: string;
  level2date: Date;
  creater: string;
  createdAt: Date;
  updater: string;
  updatedAt: Date;
  warehouseid: number;
  clientid: number;
  del_uuid: number;
  deletedAt: Date;
  deleter: string;

  constructor(createOutboundDto: IOutboundDto) {
    this.outboundid = createOutboundDto.outboundid;
    this.outboundcode = createOutboundDto.outboundcode;
    this.outboundtype = createOutboundDto.outboundtype;
    this.outdate = createOutboundDto.outdate;
    this.moneytype = createOutboundDto.moneytype;
    this.relatednumber = createOutboundDto.relatednumber;
    this.remark1 = createOutboundDto.remark1;
    this.remark2 = createOutboundDto.remark2;
    this.remark3 = createOutboundDto.remark3;
    this.remark4 = createOutboundDto.remark4;
    this.remark5 = createOutboundDto.remark5;
    this.printcount = createOutboundDto.printcount;
    this.level1review = createOutboundDto.level1review;
    this.level1name = createOutboundDto.level1name;
    this.level1date = createOutboundDto.level1date;
    this.level2review = createOutboundDto.level2review;
    this.level2name = createOutboundDto.level2name;
    this.level2date = createOutboundDto.level2date;
    this.creater = createOutboundDto.creater;
    this.createdAt = createOutboundDto.createdAt;
    this.updater = createOutboundDto.updater;
    this.updatedAt = createOutboundDto.updatedAt;
    this.warehouseid = createOutboundDto.warehouseid;
    this.clientid = createOutboundDto.clientid;
    this.del_uuid = createOutboundDto.del_uuid;
    this.deletedAt = createOutboundDto.deletedAt;
    this.deleter = createOutboundDto.deleter;
  }
}

