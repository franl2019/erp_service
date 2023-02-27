import {IsArray, IsInt, IsString} from "class-validator";

export class OutboundFindDto {
    @IsArray()
    warehouseids: number[];
    @IsArray()
    operateareaids: number[];

    @IsInt()
    clientid: number;

    @IsString()
    startDate: string;
    @IsString()
    endDate: string;
    @IsInt()
    outboundid: number;
    @IsString()
    outboundcode: string;
    @IsInt()
    outboundtype: number;
    @IsString()
    relatednumber: string;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
    @IsString()
    ymrep: string;

    @IsString()
    clientname: string;
    @IsString()
    moneytype: string;
    @IsString()
    remark1: string;
    @IsString()
    remark2: string
    @IsString()
    remark3: string;
    @IsString()
    remark4: string;
    @IsString()
    remark5: string;
}