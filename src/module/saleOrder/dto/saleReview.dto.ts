import {IsInt} from "class-validator";

export class SaleReviewDto {
    @IsInt()
    saleOrderId:number;
}