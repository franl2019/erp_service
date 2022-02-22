import { IsInt } from "class-validator";

export class findInboundMxDto {
  @IsInt()
  inboundid:number;
}