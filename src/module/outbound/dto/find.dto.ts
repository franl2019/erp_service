import {IsArray, IsInt, IsString} from "class-validator";
import {IOutbound} from "../outbound";

export interface IOutboundHead extends IOutbound {
    clientname: string;
    warehousename: string;
}

export interface IFindOutboundDto {
    warehouseids: number[];
    operateareaids: number[];
    clientid: number;
    clientname: string;
    ymrep: string;
    outboundid: number;
    outboundcode: string;
    outboundtype: number;
    relatednumber: string;

    startDate: string;
    endDate: string;

    page: number;
    pagesize: number;

    moneytype: string;
    remark1: string;
    remark2: string
    remark3: string;
    remark4: string;
    remark5: string;
}


export class FindOutboundDto implements IFindOutboundDto {
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