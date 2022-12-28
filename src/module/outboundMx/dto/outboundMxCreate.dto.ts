import {IOutboundMx} from "../outboundMx";
import {IsInt, IsNumber, IsString, NotEquals} from "class-validator";

export class OutboundMxCreateDto implements IOutboundMx {
    @IsInt()
    @NotEquals(0)
    outboundid: number;

    @IsInt()
    printid: number;

    @IsInt()
    @NotEquals(0)
    inventoryid: number;

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

    @IsString()
    batchNo: string;

    @IsNumber()
    @NotEquals(0)
    outqty: number;
    @IsNumber()
    @NotEquals(0)
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

    @IsInt()
    @NotEquals(0)
    clientid: number;

    @IsInt()
    @NotEquals(0)
    warehouseid: number;

    @IsString()
    otherUnit:string;
    @IsNumber()
    @NotEquals(0)
    otherUnitConversionRate:number;
    @IsString()
    kz_productCode:string;
    @IsString()
    kz_productName:string;
    @IsString()
    kz_spec:string;
    @IsString()
    kz_materials:string;
    @IsString()
    kz_remark:string;
    @IsString()
    kz_spec_d:string;
    @IsString()
    kz_materials_d:string;

    @IsString()
    remark1:string;

    @IsString()
    remark2:string;

    @IsString()
    remark3:string;

    @IsString()
    remark4:string;

    @IsString()
    remark5:string;

    @IsNumber()
    returnGoodsQty:number;

    constructor(outboundMx: IOutboundMx) {
        this.outboundid = outboundMx.outboundid;
        this.printid = outboundMx.printid;
        this.inventoryid = outboundMx.inventoryid;
        this.productid = outboundMx.productid;
        this.spec_d = outboundMx.spec_d;
        this.materials_d = outboundMx.materials_d;
        this.remarkmx = outboundMx.remarkmx;
        this.remark = outboundMx.remark;
        this.batchNo = outboundMx.batchNo;
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
        this.otherUnit = outboundMx.otherUnit;
        this.otherUnitConversionRate = outboundMx.otherUnitConversionRate;
        this.kz_productCode = outboundMx.kz_productCode;
        this.kz_productName = outboundMx.kz_productName;
        this.kz_spec = outboundMx.kz_spec;
        this.kz_materials = outboundMx.kz_materials;
        this.kz_remark = outboundMx.kz_remark;
        this.kz_spec_d = outboundMx.kz_spec_d;
        this.kz_materials_d = outboundMx.kz_materials_d;

        this.remark1 = outboundMx.remark1;
        this.remark2 = outboundMx.remark2;
        this.remark3 = outboundMx.remark3;
        this.remark4 = outboundMx.remark4;
        this.remark5 = outboundMx.remark5;
        this.returnGoodsQty = outboundMx.returnGoodsQty;
    }
}