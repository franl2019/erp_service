import { IsInt, NotEquals } from "class-validator";

export class L2ReviewProductDto {
  @IsInt()
  @NotEquals(0)
  productid: number;

  @IsInt()
  level2review: number;

  level2name:string;

  level2date:Date;
}