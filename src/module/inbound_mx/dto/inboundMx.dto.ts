import { IsInt, IsNumber, IsString } from "class-validator";
import { IInbound_mx } from "../inbound_mx";

export class InboundMxDto implements IInbound_mx {
  @IsInt()
  inboundid: number;
  @IsInt()
  printid: number;
  @IsInt()
  clientid: number;
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
  inqty: number;
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
  agio: number;
  @IsNumber()
  agio1: number;
  @IsNumber()
  agio2: number;
  @IsInt()
  pricetype: number;

  constructor(inbound_mx: IInbound_mx) {
    this.inboundid = inbound_mx.inboundid;
    this.printid = inbound_mx.printid;
    this.clientid = inbound_mx.clientid;
    this.productid = inbound_mx.productid;
    this.spec_d = inbound_mx.spec_d;
    this.materials_d = inbound_mx.materials_d;
    this.remarkmx = inbound_mx.remarkmx;
    this.remark = inbound_mx.remark;
    this.inqty = inbound_mx.inqty;
    this.bzqty = inbound_mx.bzqty;
    this.priceqty = inbound_mx.priceqty;
    this.price = inbound_mx.price;
    this.bzprice = inbound_mx.bzprice;
    this.netprice = inbound_mx.netprice;
    this.agio = inbound_mx.agio;
    this.agio1 = inbound_mx.agio1;
    this.agio2 = inbound_mx.agio2;
    this.pricetype = inbound_mx.pricetype;

  }
}