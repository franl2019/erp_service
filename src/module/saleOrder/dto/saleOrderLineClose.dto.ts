import {IsBoolean, IsInt, NotEquals} from "class-validator";

export class SaleOrderLineCloseDto {
    @IsInt()
    @NotEquals(0)
    saleOrderId:number;

    @IsInt()
    saleOrderMxId:number;

    @IsBoolean()
    lineClose:boolean;
}