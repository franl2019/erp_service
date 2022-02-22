import { IsInt } from "class-validator";

export class SelectUserWarehouseMxDto {
  @IsInt()
  userid:number;

  warehouseid:number;
}