import {IsArray, IsDateString, IsInt, IsNumber, IsString} from "class-validator";

export class SaleOrderFindDto {
    @IsInt()
    saleOrderId:number;

    @IsString()
    saleOrderCode:string;

    @IsDateString()
    startDate:string;
    @IsDateString()
    endDate:string;

    @IsString()
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
}