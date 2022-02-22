import {IFindOutboundDto} from "../../outbound/dto/find.dto";
import {IsArray, IsInt, IsString} from "class-validator";

export class FindSaleOutboundDto implements IFindOutboundDto{
    @IsArray()
    warehouseids: number[];
    @IsArray()
    operateareaids: number[];
    @IsInt()
    clientid: number;
    @IsString()
    startOutDate: string;
    @IsString()
    endOutDate: string;
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
}