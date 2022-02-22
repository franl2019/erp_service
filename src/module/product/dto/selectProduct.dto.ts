import { IsInt, IsString } from "class-validator";

export class SelectProductDto {
  warehouseids: number[];

  @IsInt()
  productareaid: number;

  @IsString()
  search: string;

  @IsInt()
  page: number;

  @IsInt()
  pagesize: number;

  @IsInt()
  useflag: number;
}