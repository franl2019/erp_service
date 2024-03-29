import {IFindInboundDto} from "../../inbound/dto/findInbound.dto";
import {IsArray, IsInt, IsString} from "class-validator";
import {CodeType} from "../../autoCode/codeType";

export class FindProductionInboundDto implements IFindInboundDto{
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
    inboundtype: CodeType = CodeType.SC;
    @IsString()
    relatednumber: string;
    @IsInt()
    page: number;
    @IsInt()
    pagesize: number;

    @IsString()
    buyname: string;
    @IsString()
    moneytype: string;
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