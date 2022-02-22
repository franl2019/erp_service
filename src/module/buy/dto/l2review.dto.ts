import { IsInt, NotEquals } from "class-validator";

export class L2reviewDto {
  @IsInt()
  @NotEquals(0)
  buyid: number;

  @IsInt()
  level2review: number;

  level2name:string;

  level2date:Date;
}