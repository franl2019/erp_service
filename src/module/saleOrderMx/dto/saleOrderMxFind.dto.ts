import {IsInt, NotEquals} from "class-validator";

export class SaleOrderMxFindDto {

    @IsInt()
    @NotEquals(0)
    saleOrderId:number
}