import { IsInt } from "class-validator";

export class DeleteProductDto {
  @IsInt()
  productid: number;

  del_uuid:number;
  deletedAt:Date;
  deleter:string;
}