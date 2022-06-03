import { IsInt, NotEquals } from "class-validator";

export class L2ReviewProductDto {
  @IsInt()
  @NotEquals(0)
  productid: number;
}