import { IsInt, NotEquals } from "class-validator";

export class DeleteBuyAreaDto {
  @IsInt()
  @NotEquals(0)
  buyareaid: number;

  del_uuid:number;
  deletedAt:Date;
  deleter:string;
}