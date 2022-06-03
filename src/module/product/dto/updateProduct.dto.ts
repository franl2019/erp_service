import { IsInt, IsNumber, IsString } from "class-validator";
import {Product} from "../product";

export class UpdateProductDto implements Product{
  @IsInt()
  productid: number;
  @IsString()
  productcode: string;
  @IsString()
  productname: string;
  @IsString()
  spec: string;
  @IsString()
  materials: string;
  @IsString()
  unit: string;
  @IsString()
  packunit: string;
  @IsNumber()
  packqty: number;
  @IsNumber()
  m3: number;
  @IsNumber()
  length: number;
  @IsNumber()
  width: number;
  @IsNumber()
  height: number;
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
  @IsString()
  remark6: string;
  @IsString()
  remark7: string;
  @IsString()
  remark8: string;
  @IsString()
  remark9: string;
  @IsString()
  remark10: string;
  @IsInt()
  useflag: number;

  updater: string;

  updatedAt: Date;

  @IsInt()
  productareaid: number;
  @IsInt()
  warehouseid: number;

  createdAt: Date;
  creater: string;
  del_uuid: number;
  deletedAt: Date;
  deleter: string;
  level1date: Date;
  level1name: string;
  level1review: number;
  level2date: Date;
  level2name: string;
  level2review: number;
}