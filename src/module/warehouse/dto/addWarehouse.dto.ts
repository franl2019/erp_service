import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddWarehouseDto {
  @IsString()
  @IsNotEmpty()
  warehousename: string;

  @IsString()
  @IsNotEmpty()
  warehousecode: string;

  @IsInt()
  warehousetype: number;

  @IsInt()
  useflag: number;

  creater: string;
  createdAt: Date;
}