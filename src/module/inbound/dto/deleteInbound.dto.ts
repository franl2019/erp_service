import { IsInt } from "class-validator";

export class DeleteInboundDto {
  @IsInt()
  inboundid: number;
}