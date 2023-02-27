import {IsInt, NotEquals} from "class-validator";

export class OutboundDeleteDto {
  @IsInt()
  @NotEquals(0)
  outboundid:number
}