import { IsInt, NotEquals } from "class-validator";

export class L2reviewClientDto {
  @IsInt()
  @NotEquals(0)
  clientid: number;

  @IsInt()
  level2review: number;
}