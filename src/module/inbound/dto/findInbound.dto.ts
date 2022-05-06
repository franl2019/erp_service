import { IsArray, IsInt, IsString } from "class-validator";

export interface IFindInboundDto {
  warehouseids: number[];
  operateareaids: number[];
  clientid: number;
  startDate: string;
  endDate: string;
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
  startDate: string;
  @IsString()
  endDate: string;
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