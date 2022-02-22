import { IsInt, NotEquals } from "class-validator";

export class DeleteClientAreaDto {
  @IsInt()
  @NotEquals(0)
  clientareaid: number;

  del_uuid:number;
  deletedAt:Date;
  deleter:string;
}