import { IsArray, IsInt, IsString } from "class-validator";
import { IOutbound } from "../outbound";

export interface IOutboundHead extends IOutbound {
  clientname: string;
  warehousename: string;
}

export interface IFindOutboundDto {
  warehouseids: number[];
  operateareaids: number[];
  clientid: number;
  startOutDate: string;
  endOutDate: string;
  outboundid: number;
  outboundcode: string;
  outboundtype: number;
  relatednumber: string;
  page: number;
  pagesize: number;
}


export class FindOutboundDto implements IFindOutboundDto {
  @IsArray()
  warehouseids: number[];
  @IsArray()
  operateareaids: number[];
  @IsInt()
  clientid: number;
  @IsString()
  startOutDate: string;
  @IsString()
  endOutDate: string;
  @IsInt()
  outboundid: number;
  @IsString()
  outboundcode: string;
  @IsInt()
  outboundtype: number;
  @IsString()
  relatednumber: string;
  @IsInt()
  page: number;
  @IsInt()
  pagesize: number;
}