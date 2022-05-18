import { IOutboundMx } from "./outboundMx";

export interface IFindOutboundMx extends IOutboundMx {
  warehousename: string;
  clientname: string;
  productcode: string;
  productname: string;
  materials: string;
  spec: string;
  packqty: number;
  unit: string;
}