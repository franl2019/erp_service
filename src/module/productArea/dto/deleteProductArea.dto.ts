import { IsInt, NotEquals } from "class-validator";

export class DeleteProductAreaDto {
  @IsInt()
  @NotEquals(0)
  productareaid: number;

  del_uuid:number;
  deletedAt:Date;
  deleter:string;
}