import { IsInt } from "class-validator";

export class DeleteWarehouseDto {
  @IsInt()
  warehouseid: number;

  del_uuid:number;
  deletedAt:Date;
  deleter:string;
}