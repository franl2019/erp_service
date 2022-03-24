import {Injectable} from "@nestjs/common";
import {InboundService} from "../inbound/inbound.service";
import {FindBuyInboundDto} from "./dto/findBuyInbound.dto";
import {BuyInboundDto} from "./dto/buyInbound.dto";
import * as mathjs from "mathjs";
import {bignumber} from "mathjs";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountsPayable} from "../accountsPayable/accountsPayable";
import {AccountCategoryType} from "../accountsVerifySheetMx/accountCategoryType";
import {CodeType} from "../autoCode/codeType";
import {AccountsPayableService} from "../accountsPayable/accountsPayable.service";

@Injectable()
export class BuyInboundService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly inboundService: InboundService,
        private readonly accountsPayableService:AccountsPayableService
    ) {
    }

    public async find(findDto: FindBuyInboundDto) {
        return await this.inboundService.find(findDto);
    }

    public async create(buyInboundDto: BuyInboundDto) {
        return await this.inboundService.createInbound(buyInboundDto);
    }

    public async update(buyInboundDto: BuyInboundDto) {
        return await this.inboundService.update(buyInboundDto);
    }

    public async delete_data(inboundId: number, userName: string) {
        return await this.inboundService.delete_data(inboundId, userName);
    }

    public async unDelete_data(inboundId: number) {
        return await this.inboundService.undelete_data(inboundId);
    }

    public async level1Review(inboundId: number, userName: string) {
        return await this.inboundService.level1Review(inboundId, userName);
    }

    public async unLevel1Review(inboundId: number, userName: string) {
        return await this.inboundService.unLevel1Review(inboundId, userName);
    }

    //财审
    public async level2Review(inboundId: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async () => {
            await this.inboundService.level2Review(inboundId, userName);
            const inbound = await this.inboundService.findById(inboundId);
            //根据进仓单明细计算应付金额
            const inboundMxList = await this.inboundService.findMxById(inboundId);
            let amounts: number = 0;
            for (let i = 0; i < inboundMxList.length; i++) {
                const inboundMxAmount = Number(
                    mathjs.round(
                        mathjs.chain(
                            mathjs.bignumber(inboundMxList[i].priceqty)
                        ).multiply(
                            mathjs.bignumber(inboundMxList[i].netprice)
                        ).done(), 4)
                );
                amounts = Number(
                    mathjs.round(
                        mathjs.chain(bignumber(amounts))
                            .add(bignumber(inboundMxAmount))
                            .done()
                        , 4)
                )
            }

            const accountsPayable:IAccountsPayable = {
                accountsPayableId: 0,
                accountsPayableType: AccountCategoryType.accountsPayable,
                correlationId: inbound.inboundid,
                correlationType: CodeType.CG,
                buyid: inbound.buyid,
                inDate: inbound.indate,
                amounts: amounts,
                checkedAmounts: 0,
                notCheckAmounts: amounts,
                creater: inbound.level2name,
                createdAt: inbound.level2date,
                updater: "",
                updatedAt: null,
                del_uuid: 0,
                deletedAt: null,
                deleter: "",
            }

            await this.accountsPayableService.createAccountPayable(accountsPayable);

        })

    }

    //撤销财审
    public async unLevel2Review(inboundId: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async ()=>{
            await this.inboundService.unLevel2Review(inboundId, userName);
            await this.accountsPayableService.deleteByCorrelation(inboundId,CodeType.CG);
        })
    }
}