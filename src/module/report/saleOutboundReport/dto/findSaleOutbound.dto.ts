import {IsArray, IsInt, IsString} from "class-validator";

export interface IFindSaleOutboundDto {
    warehouseids: number[];
    operateareaids: number[];
    clientid: number;
    startDate: string;
    endDate: string;
    outboundid: number;
    outboundcode: string;
    outboundtype: number;
    relatednumber: string;
    page: number;
    pagesize: number;
}

export class FindSaleOutboundDto implements IFindSaleOutboundDto {
    @IsInt()
    clientid: number;
    @IsArray()
    operateareaids: number[];
    @IsArray()
    warehouseids: number[];
    @IsString()
    outboundcode: string;
    @IsInt()
    outboundid: number;
    @IsInt()
    outboundtype: number;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
    @IsString()
    relatednumber: string;
    @IsString()
    startDate: string;
    @IsString()
    endDate: string;

}