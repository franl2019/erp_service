import { IsInt } from "class-validator";

export interface IFindOutboundMxDto {
  outboundid:number;
}

export class FindOutboundMxDto implements IFindOutboundMxDto{
  @IsInt()
  outboundid:number;
}