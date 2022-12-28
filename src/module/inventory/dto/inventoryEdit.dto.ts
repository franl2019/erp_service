import {IsDate, IsInt, IsNumber, IsString, NotEquals} from "class-validator";
import {IInventory} from "../inventory";

export class InventoryEditDto implements IInventory{
  @IsString()
  spec_d: string;

  @IsString()
  materials_d: string;

  @IsString()
  remark: string;

  @IsString()
  remarkmx: string;

  @IsString()
  batchNo: string;

  @IsNumber()
  qty: number;

  @IsDate()
  updatedAt: Date;

  @IsString()
  updater: string;

  @IsNumber()
  latest_sale_price: number;

  @IsInt()
  @NotEquals(0)
  productid: number;

  @IsInt()
  @NotEquals(0)
  clientid: number;

  @IsInt()
  warehouseid: number;

  inventoryid: number;
}