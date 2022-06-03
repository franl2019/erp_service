import { IsInt, NotEquals } from "class-validator";

export class L1reviewBuyDto {
  @IsInt()
  @NotEquals(0)
  buyid: number;
}