import { IInboundMx } from "../inbound_mx";

export interface IFindInboundMx extends IInboundMx{
  clientname:string;
  productcode:string;
  productname:string;
  materials:string;
  spec:string;
  packqty:number;
  unit:string;
}