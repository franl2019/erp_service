import {Injectable} from "@nestjs/common";
import {OutboundEntity} from "./outbound.entity";
import {Outbound} from "./outbound";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IOutboundDto} from "./dto/outbound.dto";
import {Outbound_mxService} from "../outbound_mx/outbound_mx.service";
import {State} from "../../interface/IState";
import {IFindOutboundDto} from "./dto/find.dto";
import {AddInventoryDto} from "../inventory/dto/addInventory.dto";
import {InventoryService} from "../inventory/inventory.service";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {AccountsReceivableService} from "../accountsReceivable/accountsReceivable.service";
import {AccountsReceivableMxService} from "../accountsReceivableMx/accountsReceivableMx.service";
import {CodeType} from "../autoCode/codeType";
import * as mathjs from "mathjs";
import {AccountCategory} from "../accountsVerifySheetMx/accountCategory";

@Injectable()
export class OutboundService {

    constructor(
        private readonly mysqlAls: MysqldbAls,
        private readonly outboundEntity: OutboundEntity,
        private readonly outboundMxService: Outbound_mxService,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly inventoryService: InventoryService,
        private readonly accountsReceivableService: AccountsReceivableService,
        private readonly accountsReceivableMxService: AccountsReceivableMxService,
    ) {
    }

    //查询单头
    public async find(findDto: IFindOutboundDto) {
        return await this.outboundEntity.find(findDto);
    }

    //创建出仓单
    public async createOutbound(createOutboundDto: IOutboundDto, state: State) {
        return this.mysqlAls.sqlTransaction(async () => {
            //创建单号
            createOutboundDto.outboundcode = await this.autoCodeMxService.getAutoCode(createOutboundDto.outboundtype);
            createOutboundDto.creater = state.user.username;
            createOutboundDto.createdAt = new Date();
            //创建单头
            const outbound = new Outbound(createOutboundDto);
            const createResult = await this.outboundEntity.create(outbound);
            //将单头ID填写到明细中
            for (let i = 0; i < createOutboundDto.outboundMx.length; i++) {
                createOutboundDto.outboundMx[i].outboundid = createResult.insertId;
            }
            //创建明细
            await this.outboundMxService.create(createOutboundDto.outboundMx);
        });
    }

    //修改出仓单
    public async editOutbound(updateOutboundDto: IOutboundDto, state: State) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound_db = await this.outboundEntity.findOne(updateOutboundDto.outboundid);

            //检查是否已经审核
            if (outbound_db.level1review !== 0 && outbound_db.level2review !== 0) {
                return Promise.reject(new Error("出仓单已经审核，请先撤销审核"));
            }

            //添加修改信息
            updateOutboundDto.updater = state.user.username;
            updateOutboundDto.updatedAt = new Date();
            //修改单头
            const outbound = new Outbound(updateOutboundDto);
            await this.outboundEntity.update(outbound);
            //删除现有明细
            await this.outboundMxService.delete_data(outbound.outboundid);
            //修改明细
            const outboundMx = updateOutboundDto.outboundMx;

            //为新明细添加出仓单ID
            for (let i = 0; i < outboundMx.length; i++) {
                outboundMx[i].outboundid = outbound.outboundid;
            }

            await this.outboundMxService.create(outboundMx);
        });
    }

    //删除出仓单
    public async delete_data(outboundid: number, state: State) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findOne(outboundid);
            //检查是否已经审核
            if (outbound.level1review !== 0 && outbound.level2review !== 0) {
                return Promise.reject(new Error("出仓单已经审核，请先撤销审核"));
            }

            //检查是否未删除
            if (outbound.del_uuid !== 0 && outbound.deleter.length > 0) {
                return Promise.reject(new Error("进仓单已删除，请勿重复删除"));
            }

            //为需要删除的出仓单，标记删除信息
            outbound.del_uuid = outbound.outboundid;
            outbound.deleter = state.user.username;
            outbound.deletedAt = new Date();

            //修改出仓单
            await this.outboundEntity.update(outbound);
        });
    }

    //取消删除出仓单
    public async undelete_data(outboundid: number) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findOne(outboundid);
            //检查审核状态
            if (outbound.level1review !== 0 && outbound.level2review !== 0) {
                return Promise.reject(new Error("出仓单审核状态异常，联系管理员"));
            }

            //检查是否已经删除
            if (outbound.del_uuid === 0 && outbound.deleter.length === 0) {
                return Promise.reject(new Error("进仓单未删除，无法取消删除"));
            }

            //清除删除标记
            outbound.del_uuid = 0;
            outbound.deleter = "";
            outbound.deletedAt = null;

            //修改出仓单
            await this.outboundEntity.update(outbound);
        });
    }

    //审核出仓单
    public async l1Review(outboundid: number, state: State) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findOne(outboundid);
            //检查是否未审核
            if (outbound.level1review !== 0 && outbound.level2review !== 0) {
                return Promise.reject(new Error("审核失败,审核标记有误"));
            }

            //检查是否已经删除
            if (outbound.del_uuid !== 0 && outbound.deleter.length !== 0) {
                return Promise.reject(new Error("进仓单已删除，无法审核"));
            }

            //更新出仓单审核状态
            outbound.level1review = 1;
            outbound.level1name = state.user.username;
            outbound.level1date = new Date();
            await this.outboundEntity.update(outbound);

            //扣减库存
            //获取需要进仓的明细
            const outboundMxList = await this.outboundMxService.find_entity(outbound.outboundid);
            for (let i = 0; i < outboundMxList.length; i++) {
                const outboundMx = outboundMxList[i];
                const inventory = new AddInventoryDto();
                inventory.productid = outboundMx.productid;
                inventory.spec_d = outboundMx.spec_d;
                inventory.materials_d = outboundMx.materials_d;
                inventory.remark = outboundMx.remark;
                inventory.remarkmx = outboundMx.remarkmx;
                inventory.qty = outboundMx.outqty;
                inventory.updatedAt = new Date();
                inventory.updater = state.user.username;
                inventory.latest_sale_price = outboundMx.netprice;
                inventory.clientid = outboundMx.clientid;
                inventory.warehouseid = outboundMx.warehouseid;

                if (inventory.clientid === 0) {
                    return Promise.reject(new Error("出仓单明细缺少客户资料"))
                }

                if (inventory.warehouseid && inventory.warehouseid === 0) {
                    return Promise.reject(new Error("出仓单明细缺少仓库资料"))
                }

                //出仓每个明细
                await this.inventoryService.subtractInventory(inventory);
            }
        })
    }

    //撤审出仓单
    public async unL1Review(outboundid: number, state: State) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findOne(outboundid);
            //检查是否未审核
            if (outbound.level1review !== 1 && outbound.level2review !== 0) {
                return Promise.reject(new Error("审核失败,审核标记有误"));
            }

            //检查是否已经删除
            if (outbound.del_uuid !== 0 && outbound.deleter.length !== 0) {
                return Promise.reject(new Error("进仓单已删除，无法审核"));
            }

            //更新出仓单审核状态
            outbound.level1review = 0;
            outbound.level1name = "";
            outbound.level1date = null;
            await this.outboundEntity.update(outbound);

            //扣减库存
            //获取需要进仓的明细
            const outboundMxList = await this.outboundMxService.find_entity(outbound.outboundid);
            for (let i = 0; i < outboundMxList.length; i++) {
                const outboundMx = outboundMxList[i];
                const inventory = new AddInventoryDto();
                inventory.productid = outboundMx.productid;
                inventory.spec_d = outboundMx.spec_d;
                inventory.materials_d = outboundMx.materials_d;
                inventory.remark = outboundMx.remark;
                inventory.remarkmx = outboundMx.remarkmx;
                inventory.qty = outboundMx.outqty;
                inventory.updatedAt = new Date();
                inventory.updater = state.user.username;
                inventory.latest_sale_price = outboundMx.netprice;
                inventory.clientid = outboundMx.clientid;
                inventory.warehouseid = outboundMx.warehouseid;

                if (inventory.clientid === 0) {
                    return Promise.reject(new Error("出仓单明细缺少客户资料"))
                }

                if (inventory.warehouseid && inventory.warehouseid === 0) {
                    return Promise.reject(new Error("出仓单明细缺少仓库资料"))
                }

                //增加每个明细
                await this.inventoryService.addInventory(inventory);
            }
        })
    }

    //财务审核
    public async l2Review(outboundId: number, userName: string) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findOne(outboundId);
            //检查能否审核 仓审 = 1 财审 = 0 删除标记 = 0
            if (outbound.level1review !== 1 && outbound.level2review !== 0 && outbound.del_uuid !== 0) {
                return Promise.reject(new Error("审核失败,审核标记有误"));
            }

            //计算出仓单，应收金额
            const outboundMxList = await this.outboundMxService.find(outboundId);

            //单据应收金额
            let amounts: number = 0;

            for (let i = 0; i < outboundMxList.length; i++) {
                const outboundMx = outboundMxList[i];
                amounts = Number(mathjs.chain(mathjs.bignumber(outboundMx.priceqty)).multiply(mathjs.bignumber(outboundMx.netprice)));
            }

            //增加应收账款
            const createAccountsReceivableResult = await this.accountsReceivableService.create({
                accountsReceivableId: 0,
                accountsReceivableType: AccountCategory.accountsReceivable,
                amounts: amounts,
                checkedAmounts: 0,
                notCheckAmounts: amounts,
                clientid: outbound.clientid,
                correlationId: outbound.outboundid,
                correlationType: CodeType.XS,
                inDate: outbound.outdate,
                creater: userName,
                createdAt: new Date(),
                updater: "",
                updatedAt: null,
                del_uuid: 0,
                deletedAt: null,
                deleter: ""
            });

            //增加应收账款明细
            await this.accountsReceivableMxService.create({
                accountReceivableMxId: 0,
                accountsReceivableId: createAccountsReceivableResult.insertId,
                inDate: new Date(),
                receivables: amounts,
                actuallyReceived: 0,
                advancesReceived: 0,
                correlationId: outbound.outboundid,
                correlationType: CodeType.XS,
                abstract: "",
                reMark: "",
                creater: userName,
                createdAt: new Date(),
                updater: "",
                updatedAt: null,
            })

            //更新出仓单审核状态
            outbound.level2review = 1;
            outbound.level2name = userName;
            outbound.level2date = new Date();
            await this.outboundEntity.update(outbound);
        })
    }

    //财务撤审
    public async unL2Review(outboundId: number, userName: string) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findOne(outboundId);

            //检查能否审核 仓审 = 1 财审 = 1 删除标记 = 0
            if (outbound.level1review !== 1 && outbound.level2review !== 1 && outbound.del_uuid !== 0) {
                return Promise.reject(new Error("审核失败,审核标记有误"));
            }

            //检查是否已经核销
            const accountsReceivableList = await this.accountsReceivableService.find({
                accountsReceivableId: 0,
                accountsReceivableType: AccountCategory.accountsReceivable,
                clientid: 0,
                correlationId: outbound.outboundid,
                correlationType: CodeType.XS,
                startDate: "",
                endDate: "",
                page: 0,
                pagesize: 0
            })

            if (accountsReceivableList.length <= 0 && accountsReceivableList[0]) {
                const accountsReceivable = accountsReceivableList[0];
                if (accountsReceivable.notCheckAmounts > 0) {
                    return Promise.reject(new Error('财务撤审失败,销售单已进行核销'));
                } else {
                    await this.accountsReceivableService.deleteById(accountsReceivable.accountsReceivableId, userName);
                    await this.accountsReceivableMxService.deleteById(accountsReceivable.accountsReceivableId);
                }
            } else {
                return Promise.reject(new Error('财务撤审失败,查询应收账款失败'));
            }

            //更新出仓单审核状态
            outbound.level2review = 0;
            outbound.level2name = "";
            outbound.level2date = null;
            await this.outboundEntity.update(outbound);
        });
    }

}