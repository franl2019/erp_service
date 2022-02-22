import { IsInt } from "class-validator";

export class DeleteOutboundDto {
  @IsInt()
  outboundid:number
}