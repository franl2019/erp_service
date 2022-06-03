import { IsInt, NotEquals } from "class-validator";

export class L1ReviewProductDto {
  @IsInt()
  @NotEquals(0)
  productid: number;
}