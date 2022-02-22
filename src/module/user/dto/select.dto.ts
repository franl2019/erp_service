import { IsNumber } from "class-validator";

export class SelectDto {
  @IsNumber()
  userid:number
}