import { IsInt, NotEquals } from "class-validator";

export class DeleteClientAreaDto {
  @IsInt()
  @NotEquals(0)
  clientareaid: number;
}