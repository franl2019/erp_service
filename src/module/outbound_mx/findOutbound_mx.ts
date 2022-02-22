import { IOutbound_mx } from "./outbound_mx";

export interface IFindOutboundMx extends IOutbound_mx {
  warehousename: string;
  clientname: string;
  productcode: string;
  productname: string;
  materials: string;
  spec: string;
  packqty: number;
  unit: string;
}