import { IsInt, NotEquals } from "class-validator";

export class DeleteBuyDto {
  @IsInt()
  @NotEquals(0)
  buyid: number;

  del_uuid:number;

  deletedAt:Date;

  deleter:string;
}