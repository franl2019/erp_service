import {IOutboundDto} from "../../outbound/dto/outbound.dto";
import {IsArray, IsDateString, IsInt, IsString, NotEquals} from "class-validator";
import {IOutboundMx} from "../../outboundMx/outboundMx";

export class SaleOutboundUpdateDto implements IOutboundDto{
    @IsInt()
    @NotEquals(0)
    outboundid: number;
    outboundcode: string;
    @IsDateString()
    outdate: Date;
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
    warehouseid: number;
    @IsInt()
    clientid: number;
    @IsArray()
    outboundMx: IOutboundMx[];

    printcount: number;
    outboundtype: number;
    level1review: number;
    level1name: string;
    level1date: Date;
    level2review: number;
    level2name: string;
    level2date: Date;
    creater: string;
    createdAt: Date;
    updater: string;
    updatedAt: Date;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;
}