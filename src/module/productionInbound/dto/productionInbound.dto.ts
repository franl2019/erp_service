import {IInboundDto} from "../../inbound/dto/Inbound.dto";
import {IsArray, IsInt, IsString} from "class-validator";
import {InboundMxDto} from "../../inboundMx/dto/inboundMx.dto";

export class ProductionInboundDto implements IInboundDto {
    @IsInt()
    inboundid: number;
    @IsString()
    inboundcode: string;
    @IsInt()
    inboundtype: number;
    @IsString()
    indate: Date;
    @IsString()
    moneytype: string;
    @IsString()
    relatednumber: string;
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
    @IsInt()
    printcount: number;
    @IsInt()
    level1review: number;
    @IsString()
    level1name: string;
    level1date: Date;
    @IsInt()
    level2review: number;
    @IsString()
    level2name: string;
    level2date: Date;
    creater: string;
    createdAt: Date;
    updater: string;
    updatedAt: Date;
    @IsInt()
    warehouseid: number;
    @IsInt()
    clientid: number;
    @IsInt()
    buyid: number;
    @IsInt()
    del_uuid: number;
    deletedAt: Date;
    @IsString()
    deleter: string;
    @IsArray()
    inboundmx: InboundMxDto[]
}