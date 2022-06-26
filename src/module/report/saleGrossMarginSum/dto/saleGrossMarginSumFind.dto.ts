import {IsDateString} from "class-validator";

export class SaleGrossMarginSumFindDto {
    @IsDateString()
    startDate:string;
    @IsDateString()
    endDate:string;
}