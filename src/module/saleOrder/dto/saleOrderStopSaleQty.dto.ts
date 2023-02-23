import {IsInt, IsNumber, NotEquals} from "class-validator";

export class SaleOrderStopSaleQtyDto {
    @IsInt()
    @NotEquals(0)
    saleOrderId:number;

    @IsInt()
    saleOrderMxId:number;

    @IsNumber()
    stopQty:number;
}