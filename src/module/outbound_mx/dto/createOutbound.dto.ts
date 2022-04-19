import { IOutboundMx } from "../outbound_mx";
import { IsInt, IsNumber, IsString } from "class-validator";

export class CreateOutboundDto implements IOutboundMx {
  @IsInt()
  outboundid: number;
  @IsInt()
  printid: number;
  @IsInt()
  inventoryid: number;
  @IsInt()
  productid: number;
  @IsString()
  spec_d: string;
  @IsString()
  materials_d: string;
  @IsString()
  remarkmx: string;
  @IsString()
  remark: string;
  @IsNumber()
  outqty: number;
  @IsNumber()
  bzqty: number;
  @IsNumber()
  priceqty: number;
  @IsNumber()
  price: number;
  @IsNumber()
  bzprice: number;
  @IsNumber()
  netprice: number;
  @IsNumber()
  floatprice1: number;
  @IsNumber()
  floatprice2: number;
  @IsNumber()
  floatprice3: number;
  @IsNumber()
  agio: number;
  @IsNumber()
  agio1: number;
  @IsNumber()
  agio2: number;
  @IsInt()
  pricetype: number;
  @IsInt()
  clientid: number;
  @IsInt()
  warehouseid: number;

  constructor(outboundMx: IOutboundMx) {
    this.outboundid = outboundMx.outboundid;
    this.printid = outboundMx.printid;
    this.inventoryid = outboundMx.inventoryid;
    this.productid = outboundMx.productid;
    this.spec_d = outboundMx.spec_d;
    this.materials_d = outboundMx.materials_d;
    this.remarkmx = outboundMx.remarkmx;
    this.remark = outboundMx.remark;
    this.outqty = outboundMx.outqty;
    this.bzqty = outboundMx.bzqty;
    this.priceqty = outboundMx.priceqty;
    this.price = outboundMx.price;
    this.bzprice = outboundMx.bzprice;
    this.netprice = outboundMx.netprice;
    this.floatprice1 = outboundMx.floatprice1;
    this.floatprice2 = outboundMx.floatprice2;
    this.floatprice3 = outboundMx.floatprice3;
    this.agio = outboundMx.agio;
    this.agio1 = outboundMx.agio1;
    this.agio2 = outboundMx.agio2;
    this.pricetype = outboundMx.pricetype;
    this.clientid = outboundMx.clientid;
    this.warehouseid = outboundMx.warehouseid;
  }
}