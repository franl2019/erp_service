import {IOutbound} from "../outbound";

export interface IOutboundHead extends IOutbound {
    clientname: string;
    warehousename: string;
}

export interface IOutboundFindDto {
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