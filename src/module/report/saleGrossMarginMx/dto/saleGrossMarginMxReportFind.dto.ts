import {IsArray, IsDateString, IsInt, IsString} from "class-validator";

export class SaleGrossMarginMxReportFindDto {
    @IsDateString()
    startDate:string;

    @IsDateString()
    endDate:string

    @IsString()
    outboundcode:string

    @IsInt()
    clientid:number

    @IsInt()
    productid:number;

    @IsString()
    productcode:string;

    @IsString()
    productname:string;

    @IsString()
    spec:string

    @IsString()
    unit:string

    @IsString()
    materials:string

    @IsString()
    spec_d:string

    @IsString()
    materials_d:string

    @IsString()
    remark:string

    @IsString()
    remarkmx:string

    @IsArray()
    warehouseids: number[];

    @IsArray()
    operateareaids: number[];
}