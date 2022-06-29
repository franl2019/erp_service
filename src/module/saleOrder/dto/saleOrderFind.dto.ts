import {IsArray, IsDateString, IsInt, IsNumber, IsString} from "class-validator";

export class SaleOrderFindDto {
    @IsInt()
    saleOrderId:number;
    @IsDateString()
    startDate:string;
    @IsDateString()
    endDate:string;

    @IsDateString()
    deliveryDate:string;
    @IsArray()
    warehouseids:number[];
    @IsInt()
    clientid:number;
    @IsString()
    clientname:string;
    @IsString()
    ymrep:string;
    @IsInt()
    saleOrderState:number;

    @IsNumber()
    deposit:number

    @IsString()
    moneytype:string;
    @IsString()
    relatednumber:string;
    @IsInt()
    stopReview:number;
    @IsInt()
    manualFinishReview:number;
    @IsInt()
    urgentReview:number;
    @IsInt()
    level1Review:number;
    @IsInt()
    level2Review:number;
}