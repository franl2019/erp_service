export interface IOutbound {
    outboundid: number;
    outboundcode: string;
    outboundtype: number;
    outdate: Date;
    deliveryDate: Date;
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
    operateareaid: number;
    clientid: number;
    del_uuid: number;
    deletedAt: Date;
    deleter: string;
}

