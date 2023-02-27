import {IClient} from "../client/client";
import {IOutboundMx} from "../outboundMx/outboundMx";
import * as mathjs from "mathjs";
import {useVerifyParam} from "../../utils/verifyParam/useVerifyParam";
import {OutboundMxCreateDto} from "../outboundMx/dto/outboundMxCreate.dto";

const {chain, bignumber, round} = mathjs;

export interface IOutbound {
    outboundid: number;
    outboundcode: string;
    outboundtype: number;
    outdate: Date;
    deliveryDate: Date | null;
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
    level1date: Date | null;
    level2review: number;
    level2name: string;
    level2date: Date | null;
    creater: string;
    createdAt: Date | null;
    updater: string;
    updatedAt: Date | null;
    warehouseid: number;
    operateareaid: number;
    clientid: number;
    del_uuid: number;
    deletedAt: Date | null;
    deleter: string;
}

type IOutboundOrClient = IOutbound & IClient;

export interface IOutboundHaveAmtOrClient extends IOutboundOrClient {
    amt: number
}

export interface IOutboundSheet extends IOutbound {
    outboundMx: IOutboundMx[];
}

export class OutboundSheet implements IOutboundSheet {
    outboundid: number;
    outboundcode: string;
    outboundtype: number;
    outdate: Date;
    deliveryDate: Date | null;
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
    level1date: Date | null;
    level2review: number;
    level2name: string;
    level2date: Date | null;
    creater: string;
    createdAt: Date | null;
    updater: string;
    updatedAt: Date | null;
    warehouseid: number;
    operateareaid: number;
    clientid: number;
    del_uuid: number;
    deletedAt: Date | null;
    deleter: string;
    outboundMx: IOutboundMx[];

    constructor() {
    }

    private isNullOutboundMx() {
        return this.outboundMx.length === 0
    }

    //计算应收账款
    public calculateAccountsReceivable(): number {
        //单据应收金额
        let amounts: number = 0;
        const outboundMxList = this.outboundMx;
        for (let i = 0; i < outboundMxList.length; i++) {
            const outboundMx = outboundMxList[i];

            const amount: number = round(
                Number(
                    chain(bignumber(outboundMx.priceqty))
                        .multiply(bignumber(outboundMx.netprice))
                        .done()
                ), 2);


            amounts = Number(
                round(
                    chain(bignumber(amounts))
                        .add(bignumber(amount))
                        .done()
                    , 2)
            )
        }
        return amounts
    }

    //验证用户权限
    public isExistAuth(id: number, authIdList: number[]) {
        return authIdList.includes(id)
    }

    public setOutboundValue(outbound: IOutbound) {
        this.outboundid = outbound.outboundid;
        this.outboundcode = outbound.outboundcode;
        this.outdate = outbound.outdate;
        this.deliveryDate = outbound.deliveryDate;
        this.moneytype = outbound.moneytype;
        this.relatednumber = outbound.relatednumber;
        this.remark1 = outbound.remark1;
        this.remark2 = outbound.remark2;
        this.remark3 = outbound.remark3;
        this.remark4 = outbound.remark4;
        this.remark5 = outbound.remark5;
        this.printcount = outbound.printcount;
        this.level1review = outbound.level1review;
        this.level1name = outbound.level1name;
        this.level1date = outbound.level1date;
        this.level2review = outbound.level2review;
        this.level2name = outbound.level2name;
        this.level2date = outbound.level2date;
        this.creater = outbound.creater;
        this.createdAt = outbound.createdAt;
        this.updater = outbound.updater;
        this.updatedAt = outbound.updatedAt;
        this.warehouseid = outbound.warehouseid;
        this.operateareaid = outbound.operateareaid;
        this.clientid = outbound.clientid;
        this.del_uuid = outbound.del_uuid;
        this.deletedAt = outbound.deletedAt;
        this.deleter = outbound.deleter;
        return this
    }

    private async verifyOutboundMx(outboundMxList: IOutboundMx[]){
        for (let i = 0; i <outboundMxList.length; i++) {
            const outboundMxCreateDto = new OutboundMxCreateDto(outboundMxList[i])
            await useVerifyParam(outboundMxCreateDto)
        }
    }

    public async setOutboundMxListValue(outboundMx: IOutboundMx[]) {
        await this.verifyOutboundMx(outboundMx)
        this.outboundMx = outboundMx;
        return this
    }

    public isCanL1Review() {
        return this.level1review === 0 && this.level2review === 0 && this.del_uuid === 0
    }

    public isCanUnL1Review() {
        return this.level1review === 1 && this.level2review === 0 && this.del_uuid === 0
    }

    public isCanL2Review() {
        return this.level1review === 1 && this.level2review === 0 && this.del_uuid === 0
    }

    public isCanUnL2Review() {
        return this.level1review === 1 && this.level2review === 1 && this.del_uuid === 0
    }
}
