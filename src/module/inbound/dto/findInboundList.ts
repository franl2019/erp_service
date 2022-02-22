import { IInbound } from "../inbound";

export interface FindInboundList extends IInbound{
  warehousename:string;
  clientname?:string;
  buyname?:string;
}