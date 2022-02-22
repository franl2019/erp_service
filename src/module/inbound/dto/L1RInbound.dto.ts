import { IsInt } from "class-validator";

export class L1RInboundDto {
  @IsInt()
  inboundid:number
}