import {Injectable} from "@nestjs/common";
import {OutboundService} from "../outbound/outbound.service";
import {SaleOutboundFindDto} from "./dto/saleOutboundFind.dto";
import {CodeType} from "../autoCode/codeType";
import * as mathjs from "mathjs";
import {AccountCategoryType} from "../accountsVerifySheetMx/accountCategoryType";
import {AccountsReceivableService} from "../accountsReceivable/accountsReceivable.service";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IOutboundMx} from "../outboundMx/outboundMx";
import {IState} from "../../decorator/user.decorator";
import {SaleOutboundCreateDto} from "./dto/saleOutboundCreate.dto";
import {SaleOutboundUpdateDto} from "./dto/saleOutboundUpdate.dto";

const {chain, bignumber, round} = mathjs;

@Injectable()
export class SaleOutboundService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly outboundService: OutboundService,
        private readonly accountsReceivableService: AccountsReceivableService,
    ) {
    }

    //计算应收账款
    private static calculateAccountsReceivable(outboundMxList: IOutboundMx[]): number {
        //单据应收金额
        let amounts: number = 0;

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

    private operateareaIdExistToUser(operateareaid: number, state: IState) {
        const isExist = state.user.client_operateareaids.includes(operateareaid)
        if (!isExist) {
            return Promise.reject(new Error('没有客户数据范围权限'));
        }
    }

    public async find(findDto: SaleOutboundFindDto) {
        findDto.outboundtype = CodeType.XS
        return await this.outboundService.find(findDto);
    }

    public async findSheetState(findDto: SaleOutboundFindDto) {
        findDto.outboundtype = CodeType.XS;
        const outboundList = await this.outboundService.find(findDto);
        let completeL1Review = 0;
        let undoneL1Review = 0;
        let undoneL2Review = 0;
        for (let i = 0; i < outboundList.length; i++) {
            const outboundHead = outboundList[i];
            if (outboundHead.level1review === 0) {
                undoneL1Review = undoneL1Review + 1
            } else if (outboundHead.level1review === 1) {
                completeL1Review = completeL1Review + 1
            }

            if (outboundHead.level1review === 1 && outboundHead.level2review === 0) {
                undoneL2Review = undoneL2Review + 1
            }
        }

        return {
            completeL1Review,
            undoneL1Review,
            undoneL2Review,
        }
    }

    public async create(saleOutboundDto: SaleOutboundCreateDto, state: IState) {
        saleOutboundDto.outboundtype = CodeType.XS;
        await this.operateareaIdExistToUser(
            saleOutboundDto.operateareaid,
            state
        );
        const {insertId} = await this.outboundService.create(saleOutboundDto);
        saleOutboundDto.outboundid = insertId;
        return {
            id: saleOutboundDto.outboundid,
            code: saleOutboundDto.outboundcode
        }
    }

    public async createL1Review(saleOutboundDto: SaleOutboundCreateDto, state: IState) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const {id: outboundid, code: outboundcode} = await this.create(saleOutboundDto, state)
            await this.outboundService.l1Review(outboundid, state.user.username);
            return {
                id: outboundid,
                code: outboundcode
            }
        })
    }

    public async update(saleOutboundDto: SaleOutboundUpdateDto, state: IState):Promise<boolean> {
        saleOutboundDto.outboundtype = CodeType.XS;
        await this.operateareaIdExistToUser(
            saleOutboundDto.operateareaid,
            state
        );
        return await this.outboundService.update(saleOutboundDto, state);
    }

    public async updateL1Review(saleOutboundDto: SaleOutboundUpdateDto, state: IState) {
       return this.mysqldbAls.sqlTransaction(async ()=>{
           await this.update(saleOutboundDto,state);
           return await this.outboundService.l1Review(saleOutboundDto.outboundid, state.user.username);
       })
    }

    public async delete_data(outboundId: number, state: IState) {
        return await this.outboundService.delete_data(outboundId, state);
    }

    public async unDeleteData(outboundId: number) {
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