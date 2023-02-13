import {IsInt} from "class-validator";

export class SaleOrderReviewDto {
    @IsInt()
    saleOrderId:number;
}