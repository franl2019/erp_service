import { IsInt, NotEquals } from "class-validator";

export class L1reviewBuyDto {
  @IsInt()
  @NotEquals(0)
  buyid: number;

  @IsInt()
  level1review: number;

  level1name:string;

  level1date:Date;

  useflag:number
}