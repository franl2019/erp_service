import { IsInt } from "class-validator";

export class AddUserWarehouseMxDto {
  @IsInt()
  userid:number;

  @IsInt()
  warehouseid:number;
  creater:string;
  createdAt:Date;
}