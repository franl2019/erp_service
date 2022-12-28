import { IOutbound } from "../outbound";
import { IOutboundMx } from "../../outboundMx/outboundMx";

export interface IOutboundSheetCreateDto extends IOutbound {
  outboundMx: IOutboundMx[];
}