import { IInbound_mx } from "../inbound_mx";

export interface IFindInboundMx extends IInbound_mx{
  clientname:string;
  productcode:string;
  productname:string;
  materials:string;
  spec:string;
  packqty:number;
  unit:string;
}