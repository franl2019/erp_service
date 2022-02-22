import { IsNumber, IsString } from "class-validator";

export class SelectWarehouseDto {
  warehouseid: number;

  @IsString()
  warehousename: string;

  @IsString()
  warehousecode: string;

  @IsNumber()
  warehousetype: number;

  @IsNumber()
  useflag: number;
}