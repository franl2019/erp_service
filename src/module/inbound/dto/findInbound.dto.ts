import { IsArray, IsInt, IsString } from "class-validator";

export interface IFindInboundDto {
  warehouseids: number[];
  operateareaids: number[];
  clientid: number;
  startInDate: string;
  endInDate: string;
  inboundid: number;
  inboundcode: string;
  inboundtype: number;
  relatednumber: string;
  page: number;
  pagesize: number;
}

export class FindInboundDto implements IFindInboundDto{
  @IsArray()
  warehouseids: number[];
  @IsArray()
  operateareaids: number[];
  @IsInt()
  clientid: number;
  @IsString()
  startInDate: string;
  @IsString()
  endInDate: string;
  @IsInt()
  inboundid: number;
  @IsString()
  inboundcode: string;
  @IsInt()
  inboundtype: number;
  @IsString()
  relatednumber: string;
  @IsInt()
  page: number;
  @IsInt()
  pagesize: number;
}