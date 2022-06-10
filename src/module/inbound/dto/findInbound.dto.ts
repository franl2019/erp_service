import {IsArray, IsInt, IsString} from "class-validator";

export interface IFindInboundDto {
    warehouseids: number[];
    operateareaids: number[];
    clientid: number;
    startDate: string;
    endDate: string;
    inboundid: number;
    inboundcode: string;
    inboundtype: number;
    relatednumber: string;
    page: number;
    pagesize: number;

    moneytype: string;
    buyname: string;

    remark1: string;
    remark2: string;
    remark3: string;
    remark4: string;
    remark5: string;
}

export class FindInboundDto implements IFindInboundDto {
    @IsArray()
    warehouseids: number[];
    @IsArray()
    operateareaids: number[];
    @IsInt()
    clientid: number;

    @IsInt()
    inboundid: number;
    @IsString()
    inboundcode: string;
    @IsInt()
    inboundtype: number;

    @IsString()
    moneytype: string;

    @IsString()
    relatednumber: string;

    @IsString()
    buyname: string

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

    @IsString()
    startDate: string;
    @IsString()
    endDate: string;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
}