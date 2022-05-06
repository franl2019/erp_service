import {IFindInboundDto} from "../../inbound/dto/findInbound.dto";
import {IsArray, IsInt, IsString} from "class-validator";

export class FindBuyInboundDto implements IFindInboundDto{
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
    inboundid: number;
    @IsString()
    inboundcode: string;
    inboundtype: number = 1;
    @IsString()
    relatednumber: string;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;
}