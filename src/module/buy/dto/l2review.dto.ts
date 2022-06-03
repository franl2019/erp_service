import { IsInt, NotEquals } from "class-validator";

export class L2reviewDto {
  @IsInt()
  @NotEquals(0)
  buyid: number;
}