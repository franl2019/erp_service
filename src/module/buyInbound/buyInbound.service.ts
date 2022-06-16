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
import {IInboundMx} from "../inboundMx/inboundMx";

@Injectable()
export class BuyInboundService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly inboundService: InboundService,
        private readonly accountsPayableService: AccountsPayableService
    ) {
    }

    //计算应付账款金额
    private static calculateAccountsPayable(inboundMxList: IInboundMx[]) {
        let amounts: number = 0;
        for (let i = 0; i < inboundMxList.length; i++) {
            const inboundMxAmount = Number(
                mathjs.round(
                    mathjs.chain(
                        mathjs.bignumber(inboundMxList[i].priceqty)
                    ).multiply(
                        mathjs.bignumber(inboundMxList[i].netprice)
                    ).done(), 2)
            );

            amounts = Number(
                mathjs.round(
                    mathjs.chain(bignumber(amounts))
                        .add(bignumber(inboundMxAmount))
                        .done()
                    , 2)
            )
        }

        return amounts
    }

    public async find(findDto: FindBuyInboundDto) {
        return await this.inboundService.find(findDto);
    }

    public async findBuyInboundState(findDto: FindBuyInboundDto){
        const buyInboundList = await this.inboundService.find(findDto);
        let completeL1Review = 0;
        let undoneL1Review = 0;
        let undoneL2Review = 0;

        for (let i = 0; i < buyInboundList.length; i++) {
            const buyInbound = buyInboundList[i];
            if(buyInbound.level1review === 0){
                undoneL1Review = undoneL1Review + 1
            }else if(buyInbound.level1review === 1){
                completeL1Review = completeL1Review + 1
            }

            if(buyInbound.level1review === 1 && buyInbound.level2review === 0){
                undoneL2Review = undoneL2Review + 1
            }
        }

        return {
            completeL1Review,
            undoneL1Review,
            undoneL2Review,
        }
    }

    public async create(buyInboundDto: BuyInboundDto) {
        return await this.inboundService.createInbound(buyInboundDto);
    }

    public async create_l1Review(buyInboundDto: BuyInboundDto) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            const result = await this.inboundService.createInbound(buyInboundDto);
            await this.inboundService.level1Review(result.id, buyInboundDto.creater);
            return result
        })
    }

    public async update(buyInboundDto: BuyInboundDto) {
        return await this.inboundService.update(buyInboundDto);
    }

    public async update_l1Review(buyInboundDto: BuyInboundDto) {
        return this.mysqldbAls.sqlTransaction(async () => {
            return await this.inboundService.update_l1Review(buyInboundDto, buyInboundDto.updater);
        })
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
            const amounts: number = BuyInboundService.calculateAccountsPayable(inboundMxList);

            const accountsPayable: IAccountsPayable = {
                accountsPayableId: 0,
                accountsPayableType: AccountCategoryType.accountsPayable4,
                correlationId: inbound.inboundid,
                correlationType: CodeType.buyInbound,
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
    public async unLevel2Review(inboundId: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            await this.accountsPayableService.deleteMxByCorrelation(inboundId, CodeType.buyInbound);
            await this.accountsPayableService.deleteByCorrelation(inboundId, CodeType.buyInbound);
            await this.inboundService.unLevel2Review(inboundId);

        })
    }
}