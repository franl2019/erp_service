import {OutboundSheet} from "../outbound";
import { IOutboundMx } from "../../outboundMx/outboundMx";
import {IsArray, IsDateString, IsInt, IsString, NotEquals} from "class-validator";
import {IsDateStringOrNull} from "../../../utils/verifyParam/useCustomDecorator";


export class OutboundCreateDto extends OutboundSheet{
  outboundid: number;
  outboundcode: string;
  @IsDateStringOrNull()
  deliveryDate: Date;
  @IsDateString()
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
  @NotEquals(0)
  operateareaid: number;
  @IsInt()
  warehouseid: number;
  @IsInt()
  @NotEquals(0)
  clientid: number;
  printcount: number;
  outboundtype: number;
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
  del_uuid: number;
  deletedAt: Date;
  deleter: string;

  @IsArray()
  outboundMx: IOutboundMx[];


}