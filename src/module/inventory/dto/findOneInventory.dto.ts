import { IsInt, IsString } from "class-validator";

export class FindOneInventoryDto {
  @IsString()
  spec_d: string;

  @IsString()
  materials_d: string;

  @IsString()
  remark: string;

  @IsString()
  remarkmx: string;

  @IsInt()
  productid: number;

  @IsInt()
  clientid: number;

  @IsInt()
  warehouseid: number;
}