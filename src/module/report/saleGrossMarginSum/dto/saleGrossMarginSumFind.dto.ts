import {IsArray, IsDateString, IsInt, IsString} from "class-validator";

export class SaleGrossMarginSumFindDto {
    @IsDateString()
    startDate:string;
    @IsDateString()
    endDate:string;

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