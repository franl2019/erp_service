import { IsInt } from "class-validator";
import {IOutboundMx} from "../outboundMx";

export class OutboundMxFindDto implements IOutboundMx{
  @IsInt()
  outboundid:number;
  agio: number;
  agio1: number;
  agio2: number;
  batchNo: string;
  bzprice: number;
  bzqty: number;
  clientid: number;
  floatprice1: number;
  floatprice2: number;
  floatprice3: number;
  inventoryid: number;
  materials_d: string;
  netprice: number;
  outqty: number;
  price: number;
  priceqty: number;
  pricetype: number;
  printid: number;
  productid: number;
  remark: string;
  remarkmx: string;
  spec_d: string;
  warehouseid: number;

  otherUnit:string;
  otherUnitConversionRate:number;
  kz_productCode:string;
  kz_productName:string;
  kz_spec:string;
  kz_materials:string;
  kz_remark:string;
  kz_spec_d:string;
  kz_materials_d:string;

  remark1:string;
  remark2:string;
  remark3:string;
  remark4:string;
  remark5:string;

  returnGoodsQty:number;
}