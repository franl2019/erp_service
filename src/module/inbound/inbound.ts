import {IInboundDto} from "./dto/Inbound.dto";

export interface IInbound {
    inboundid: number;
    inboundcode: string;
    inboundtype: number;
    indate: Date;
    moneytype: string;
    relatednumber: string;
    remark1: string;
    remark2: string;
    remark3: string;
    remark4: string;
    remark5: string;
    printcount: number;
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
    warehouseid: number;
    clientid: number;
    buyid: number;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;
}

export class Inbound implements IInbound {
    inboundid: number;
    inboundcode: string;
    inboundtype: number;
    indate: Date;
    moneytype: string;
    relatednumber: string;
    remark1: string;
    remark2: string;
    remark3: string;
    remark4: string;
    remark5: string;
    printcount: number;
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
    warehouseid: number;
    clientid: number;
    buyid: number;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;

    constructor(inboundDto: IInboundDto) {
        this.inboundid = inboundDto.inboundid;
        this.inboundcode = inboundDto.inboundcode;
        this.inboundtype = inboundDto.inboundtype;
        this.indate = inboundDto.indate;
        this.moneytype = inboundDto.moneytype;
        this.relatednumber = inboundDto.relatednumber;
        this.remark1 = inboundDto.remark1;
        this.remark2 = inboundDto.remark2;
        this.remark3 = inboundDto.remark3;
        this.remark4 = inboundDto.remark4;
        this.remark5 = inboundDto.remark5;
        this.printcount = inboundDto.printcount;
        this.level1review = inboundDto.level1review;
        this.level1name = inboundDto.level1name;
        this.level1date = inboundDto.level1date;
        this.level2review = inboundDto.level2review;
        this.level2name = inboundDto.level2name;
        this.level2date = inboundDto.level2date;
        this.creater = inboundDto.creater;
        this.createdAt = inboundDto.createdAt;
        this.updater = inboundDto.updater;
        this.updatedAt = inboundDto.updatedAt;
        this.warehouseid = inboundDto.warehouseid;
        this.clientid = inboundDto.clientid;
        this.buyid = inboundDto.buyid;
        this.del_uuid = inboundDto.del_uuid;
        this.deletedAt = inboundDto.deletedAt;
        this.deleter = inboundDto.deleter;
    }
}