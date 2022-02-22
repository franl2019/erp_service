import { IsInt } from "class-validator";

export class DeleteOperateAreaDto {
  @IsInt()
  operateareaid: number;

  del_uuid:number;
  deletedAt:Date;
  deleter:string;
}