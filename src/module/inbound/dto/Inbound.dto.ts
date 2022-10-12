import {IsArray, IsDate, IsInt, IsString} from "class-validator";
import { InboundMxDto } from "../../inboundMx/dto/inboundMx.dto";
import { IInbound } from "../inbound";

export interface IInboundDto extends IInbound{
  inboundmx:InboundMxDto[]
}

export class InboundDto implements IInboundDto{
  @IsInt()
  inboundid: number;
  @IsString()
  inboundcode: string;
  @IsInt()
  inboundtype: number;
  @IsDate()
  indate: Date;
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
  buyid: number;
  @IsInt()
  del_uuid: number;
  deletedAt: Date;
  @IsString()
  deleter: string;
  @IsArray()
  inboundmx:InboundMxDto[]
}