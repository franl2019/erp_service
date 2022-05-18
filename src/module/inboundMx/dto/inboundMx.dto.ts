import {IsInt, IsNumber, IsString, NotEquals} from "class-validator";
import { IInboundMx } from "../inboundMx";

export class InboundMxDto implements IInboundMx {
  @IsInt()
  @NotEquals(0)
  inboundid: number;
  @IsInt()
  printid: number;
  @IsInt()
  @NotEquals(0)
  clientid: number;
  @IsInt()
  @NotEquals(0)
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
  @NotEquals(0)
  inqty: number;
  @IsNumber()
  @NotEquals(0)
  bzqty: number;
  @IsNumber()
  @NotEquals(0)
  priceqty: number;
  @IsNumber()
  price: number;
  @IsNumber()
  bzprice: number;
  @IsNumber()
  netprice: number;
  @IsNumber()
  @NotEquals(0)
  agio: number;
  @IsNumber()
  @NotEquals(0)
  agio1: number;
  @IsNumber()
  @NotEquals(0)
  agio2: number;
  @IsInt()
  pricetype: number;

  constructor(inbound_mx: IInboundMx) {
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