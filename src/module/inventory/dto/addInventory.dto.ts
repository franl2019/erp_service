import { IsDate, IsInt, IsNumber, IsString } from "class-validator";

export class AddInventoryDto {
  @IsString()
  spec_d: string;

  @IsString()
  materials_d: string;

  @IsString()
  remark: string;

  @IsString()
  remarkmx: string;

  @IsNumber()
  qty: number;

  @IsDate()
  updatedAt: Date;

  @IsString()
  updater: string;

  @IsNumber()
  latest_sale_price: number;

  @IsInt()
  productid: number;

  @IsInt()
  clientid: number;

  @IsInt()
  warehouseid: number;
}