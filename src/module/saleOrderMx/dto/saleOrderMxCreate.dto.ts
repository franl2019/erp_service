import {ISaleOrderMx} from "../saleOrderMx";
import {IsInt, IsNumber, IsString, NotEquals} from "class-validator";

export class SaleOrderMxCreateDto implements ISaleOrderMx {
    //销售订单头id
    @IsInt()
    @NotEquals(0)
    saleOrderId: number;
    //明细顺序
    @IsInt()
    printid: number;
    //仓库id
    @IsInt()
    warehouseid: number;
    //产品id
    @IsInt()
    @NotEquals(0)
    productid: number;
    //订做规格
    @IsString()
    spec_d: string;
    //现用料
    @IsString()
    materials_d: string;
    @IsString()
    batchNo: string;
    //明细备注
    @IsString()
    remarkmx: string;
    //备注
    @IsString()
    remark: string;
    //数量
    @IsNumber()
    outqty: number;
    //包装数量
    @IsNumber()
    bzqty: number;
    //计价数量
    priceqty: number;
    //单价
    @IsNumber()
    price: number;
    //包装单价
    @IsNumber()
    bzprice: number;
    //实价
    netprice: number;
    //浮动价
    @IsNumber()
    floatprice1: number;
    @IsNumber()
    floatprice2: number;
    @IsNumber()
    floatprice3: number;
    //折扣
    @IsNumber()
    agio: number;
    @IsNumber()
    agio1: number;
    @IsNumber()
    agio2: number;
    //汇率
    @IsNumber()
    exchangeRate: number;
    //税率
    @IsNumber()
    rate: number;
    //含税单价
    ratePrice: number;
    //含税金额
    rateAmount: number;
    //计价类型
    @IsNumber()
    pricetype: number;
    //终止数量
    stopQty: number;
    //已开单数
    openQty: number;
    //出货数量
    saleQty: number;
    @IsString()
    kz_materials: string;
    @IsString()
    kz_materials_d: string;
    @IsString()
    kz_productCode: string;
    @IsString()
    kz_productName: string;
    @IsString()
    kz_remark: string;
    @IsString()
    kz_spec: string;
    @IsString()
    kz_spec_d: string;
    @IsString()
    otherUnit: string;
    @IsNumber()
    @NotEquals(0)
    otherUnitConversionRate: number;
    @IsString()
    remark1: string;
    @IsString()
    remark2: string;
    @IsString()
    remark3: string;
    @IsString()
    remark4: string;
    @IsString()
    remark5: string;


    constructor(saleOrderMx:ISaleOrderMx) {
        this.saleOrderId = saleOrderMx.saleOrderId;
        this.printid = saleOrderMx.printid;
        this.warehouseid = saleOrderMx.warehouseid;
        this.productid = saleOrderMx.productid;
        this.spec_d = saleOrderMx.spec_d;
        this.materials_d = saleOrderMx.materials_d;
        this.batchNo = saleOrderMx.batchNo;
        this.remarkmx = saleOrderMx.remarkmx;
        this.remark = saleOrderMx.remark;
        this.outqty = saleOrderMx.outqty;
        this.bzqty = saleOrderMx.bzqty;
        this.priceqty = saleOrderMx.priceqty;
        this.price = saleOrderMx.price;
        this.bzprice = saleOrderMx.bzprice;
        this.netprice = saleOrderMx.netprice;
        this.floatprice1 = saleOrderMx.floatprice1;
        this.floatprice2 = saleOrderMx.floatprice2;
        this.floatprice3 = saleOrderMx.floatprice3;
        this.agio = saleOrderMx.agio;
        this.agio1 = saleOrderMx.agio1;
        this.agio2 = saleOrderMx.agio2;
        this.exchangeRate = saleOrderMx.exchangeRate;
        this.rate = saleOrderMx.rate;
        this.ratePrice = saleOrderMx.ratePrice;
        this.rateAmount = saleOrderMx.rateAmount;
        this.pricetype = saleOrderMx.pricetype;
        this.stopQty = saleOrderMx.stopQty;
        this.openQty = saleOrderMx.openQty;
        this.saleQty = saleOrderMx.saleQty;
        this.kz_materials = saleOrderMx.kz_materials;
        this.kz_materials_d = saleOrderMx.kz_materials_d;
        this.kz_productCode = saleOrderMx.kz_productCode;
        this.kz_productName = saleOrderMx.kz_productName;
        this.kz_remark = saleOrderMx.kz_remark;
        this.kz_spec = saleOrderMx.kz_spec;
        this.kz_spec_d = saleOrderMx.kz_spec_d;
        this.otherUnit = saleOrderMx.otherUnit;
        this.otherUnitConversionRate = saleOrderMx.otherUnitConversionRate;
        this.remark1 = saleOrderMx.remark1;
        this.remark2 = saleOrderMx.remark2;
        this.remark3 = saleOrderMx.remark3;
        this.remark4 = saleOrderMx.remark4;
        this.remark5 = saleOrderMx.remark5;
    }
}