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
import {IOutboundMx} from "../outboundMx/outboundMx";

const {chain, bignumber, round} = mathjs;

@Injectable()
export class SaleOutboundService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly outboundService: OutboundService,
        private readonly accountsReceivableService: AccountsReceivableService,
    ) {
    }

    private static calculateAccountsReceivable(outboundMxList: IOutboundMx[]): number {
        //单据应收金额
        let amounts: number = 0;

        for (let i = 0; i < outboundMxList.length; i++) {
            const outboundMx = outboundMxList[i];

            const amount: number = Number(
                round(
                    chain(bignumber(outboundMx.priceqty))
                        .multiply(bignumber(outboundMx.netprice))
                        .done()
                    , 2)
            );

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

    public async find(findDto: FindSaleOutboundDto) {
        findDto.outboundtype = CodeType.XS;
        return await this.outboundService.find(findDto);
    }

    public async findSheetState(findDto: FindSaleOutboundDto) {
        findDto.outboundtype = CodeType.XS;

        const outboundList = await this.outboundService.find(findDto);
        let completeL1Review = 0;
        let undoneL1Review = 0;
        let undoneL2Review = 0;
        for (let i = 0; i < outboundList.length; i++) {
            const outboundHead = outboundList[i];
            if(outboundHead.level1review === 0){
                undoneL1Review = undoneL1Review + 1
            }else if(outboundHead.level1review === 1){
                completeL1Review = completeL1Review + 1
            }

            if(outboundHead.level1review === 1 && outboundHead.level2review === 0){
                undoneL2Review = undoneL2Review + 1
            }
        }

        return {
            completeL1Review,
            undoneL1Review,
            undoneL2Review,
        }
    }

    public async create(saleOutboundDto: SaleOutboundDto, username: string) {
        saleOutboundDto.outboundtype = CodeType.XS;
        const result = await this.outboundService.create(saleOutboundDto, username);
        return {
            id:result.insertId,
            code:saleOutboundDto.outboundcode
        }
    }

    public async create_l1Review(saleOutboundDto: SaleOutboundDto, username: string) {
        return this.mysqldbAls.sqlTransaction(async () => {
            saleOutboundDto.outboundtype = CodeType.XS;
            const result = await this.outboundService.create(saleOutboundDto, username);
            await this.outboundService.l1Review(result.insertId, username);
            return {
                id:result.insertId,
                code:saleOutboundDto.outboundcode
            }
        })
    }

    public async update(saleOutboundDto: SaleOutboundDto, state: IState) {
        saleOutboundDto.outboundtype = CodeType.XS;
        return await this.outboundService.update(saleOutboundDto, state);
    }

    public async updateAndL1Review(saleOutboundDto: SaleOutboundDto, state: IState){
        saleOutboundDto.outboundtype = CodeType.XS;
        return await this.outboundService.updateAndL1Review(saleOutboundDto, state);
    }

    public async delete_data(outboundId: number, state: IState) {
        return await this.outboundService.delete_data(outboundId, state);
    }

    public async unDelete_data(outboundId: number) {
        return await this.outboundService.undelete_data(outboundId);
    }

    public async level1Review(outboundId: number, userName: string) {
        return await this.outboundService.l1Review(outboundId, userName);
    }

    public async unLevel1Review(outboundId: number, state: IState) {
        return await this.outboundService.unL1Review(outboundId, state);
    }

    public async level2Review(outboundId: number, userName: string) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            await this.outboundService.l2Review(outboundId, userName);
            const outbound = await this.outboundService.findById(outboundId)
            const outboundMxList: IOutboundMx[] = await this.outboundService.findMxById(outboundId);

            //计算出仓单，应收金额
            const amounts = SaleOutboundService.calculateAccountsReceivable(outboundMxList);

            //增加应收账款
            await this.accountsReceivableService.createAccountsReceivable({
                accountsReceivableId: 0,
                accountsReceivableType: AccountCategoryType.accountsReceivable1,
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