import { IsInt, NotEquals } from "class-validator";

export class L1ReviewProductDto {
  @IsInt()
  @NotEquals(0)
  productid: number;

  @IsInt()
  level1review: number;

  level1name: string;

  level1date: Date;

  useflag: number;
}