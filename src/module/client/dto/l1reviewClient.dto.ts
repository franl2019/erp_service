import { IsInt, NotEquals } from "class-validator";

export class L1reviewClientDto {
  @IsInt()
  @NotEquals(0)
  clientid: number;
}