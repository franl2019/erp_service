import { IsInt, NotEquals } from "class-validator";

export class DeleteClientDto {
  @IsInt()
  @NotEquals(0)
  clientid: number;
}