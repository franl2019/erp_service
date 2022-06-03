import { IsInt, NotEquals } from "class-validator";

export class DeleteBuyAreaDto {
  @IsInt()
  @NotEquals(0)
  buyareaid: number;
}