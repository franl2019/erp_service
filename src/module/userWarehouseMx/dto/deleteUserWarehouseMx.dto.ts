import { IsInt } from "class-validator";

export class DeleteUserWarehouseMxDto {
  @IsInt()
  userid:number;

  @IsInt()
  warehouseid:number;
}