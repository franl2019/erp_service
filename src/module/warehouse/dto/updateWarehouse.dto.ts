import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateWarehouseDto {
  @IsInt()
  warehouseid: number;

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

  updater: string;

  updatedAt: Date;
}