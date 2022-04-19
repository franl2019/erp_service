import { IOutbound } from "../outbound";
import { IOutboundMx } from "../../outbound_mx/outbound_mx";
import { IsArray, IsInt, IsString } from "class-validator";

export interface IOutboundDto extends IOutbound {
  outboundMx: IOutboundMx[];
}

export class OutboundDto implements IOutboundDto {
  @IsInt()
  outboundid: number;
  @IsString()
  outboundcode: string;
  @IsInt()
  outboundtype: number;
  @IsString()
  outdate: Date;
  @IsString()
  moneytype: string;
  @IsString()
  relatednumber: string;
  @IsString()
  remark1: string;
  @IsString()
  remark2: string;
  @IsString()
  remark3: string;
  @IsString()
  remark4: string;
  @IsString()
  remark5: string;
  @IsInt()
  printcount: number;
  @IsInt()
  level1review: number;
  @IsString()
  level1name: string;
  level1date: Date;
  @IsInt()
  level2review: number;
  @IsString()
  level2name: string;
  level2date: Date;
  @IsString()
  creater: string;
  createdAt: Date;
  @IsString()
  updater: string;
  updatedAt: Date;
  @IsInt()
  warehouseid: number;
  @IsInt()
  clientid: number;
  @IsInt()
  del_uuid: number;
  deletedAt: Date;
  @IsString()
  deleter: string;
  @IsArray()
  outboundMx: IOutboundMx[];
}