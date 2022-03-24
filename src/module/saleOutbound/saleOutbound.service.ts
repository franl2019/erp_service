import {Injectable} from "@nestjs/common";
import {OutboundService} from "../outbound/outbound.service";
import {FindSaleOutboundDto} from "./dto/findSaleOutbound.dto";
import {SaleOutboundDto} from "./dto/saleOutbound.dto";
import {IState} from "../../interface/IState";
import {CodeType} from "../autoCode/codeType";
import * as mathjs from "mathjs";
import {AccountCategoryType} from "../accountsVerifySheetMx/accountCategoryType";
import {AccountsReceivableService} from "../accountsReceivable/accountsReceivable.service";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable()
export class SaleOutboundService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly outboundService: OutboundService,
        private readonly accountsReceivableService: AccountsReceivableService,
    ) {
    }

    public async find(findDto: FindSaleOutboundDto) {
        findDto.outboundtype = 8;
        return await this.outboundService.find(findDto);
    }

    public async create(saleOutboundDto: SaleOutboundDto, state: IState) {
        saleOutboundDto.outboundtype = 8;
        return await this.outboundService.createOutbound(saleOutboundDto, state);
    }

    public async update(saleOutboundDto: SaleOutboundDto, state: IState) {
        saleOutboundDto.outboundtype = 8;
        return await this.outboundService.editOutbound(saleOutboundDto, state);
    }

    public async delete_data(outboundId: number, state: IState) {
        return await this.outboundService.delete_data(outboundId, state);
    }

    public async unDelete_data(outboundId: number) {
        return await this.outboundService.undelete_data(outboundId);
    }

    public async level1Review(outboundId: number, state: IState) {
        return await this.outboundService.l1Review(outboundId, state);
    }

    public async unLevel1Review(outboundId: number, state: IState) {
        return await this.outboundService.unL1Review(outboundId, state);
    }

    public async level2Review(outboundId: number, userName: string) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            await this.outboundService.l2Review(outboundId, userName);
            const outbound = await this.outboundService.findById(outboundId)
            const outboundMxList = await this.outboundService.findMxById(outboundId);

            //计算出仓单，应收金额
            //单据应收金额
            let amounts: number = 0;

            for (let i = 0; i < outboundMxList.length; i++) {
                const outboundMx = outboundMxList[i];
                amounts = Number(mathjs.chain(mathjs.bignumber(outboundMx.priceqty)).multiply(mathjs.bignumber(outboundMx.netprice)));
            }

            //增加应收账款
            await this.accountsReceivableService.createAccountsReceivable({
                accountsReceivableId: 0,
                accountsReceivableType: AccountCategoryType.accountsReceivable,
                amounts: amounts,
                checkedAmounts: 0,
                notCheckAmounts: amounts,
                clientid: outbound.clientid,
                correlationId: outbound.outboundid,
                correlationType: CodeType.XS,
                inDate: outbound.outdate,
                creater: outbound.level2name,
                createdAt: outbound.level2date,
                updater: "",
                updatedAt: null,
                del_uuid: 0,
                deletedAt: null,
                deleter: ""
            });
        })

    }

    public async unLevel2Review(outboundId: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            await this.outboundService.unL2Review(outboundId);
            await this.accountsReceivableService.deleteByCorrelation(outboundId, CodeType.XS);
        })
    }
}