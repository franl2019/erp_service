import {IsDateString, IsInt} from "class-validator";

export class SaleGrossMarginMxReportFindDto {
    @IsDateString()
    startDate:string;
    @IsDateString()
    endDate:string
    @IsInt()
    clientid:number
}