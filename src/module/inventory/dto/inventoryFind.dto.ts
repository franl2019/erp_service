import { IsArray, IsInt, IsString } from "class-validator";
import {IOutboundMx} from "../../outboundMx/outboundMx";

export class InventoryFindDto {
  @IsArray()
  warehouseids: number[];

  @IsInt()
  clientid: number;

  @IsArray()
  operateareaids: number[];

  @IsInt()
  useflag: number;

  @IsString()
  productcode: string;

  @IsString()
  productname: string;

  @IsString()
  materials:string;

  @IsString()
  spec:string;

  @IsString()
  materials_d:string;

  @IsString()
  spec_d:string;

  @IsString()
  remark:string

  @IsString()
  remarkmx:string

  @IsString()
  batchNo:string

  @IsString()
  unit:string;

  @IsInt()
  productareaid: number;

  @IsInt()
  page: number;

  @IsInt()
  pagesize: number;

}