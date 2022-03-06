import {InboundEntity} from "./inbound.entity";
import {FindInboundDto} from "./dto/findInbound.dto";
import {Injectable} from "@nestjs/common";
import {IInboundDto} from "./dto/Inbound.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {InventoryService} from "../inventory/inventory.service";
import {AddInventoryDto} from "../inventory/dto/addInventory.dto";
import {Inbound_mxService} from "../inbound_mx/inbound_mx.service";
import {Inbound} from "./inbound";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import * as mathjs from "mathjs";
import {AccountsPayableService} from "../accountsPayable/accountsPayable.service";
import {AccountsPayableMxService} from "../accountsPayableMx/accountsPayableMx.service";

@Injectable()
export class InboundService {
    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly inboundEntity: InboundEntity,
        private readonly inboundMxService: Inbound_mxService,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly inventoryService: InventoryService,
        private readonly accountsPayableService: AccountsPayableService,
        private readonly accountsPayableMxService: AccountsPayableMxService
    ) {
    }

    //查询进仓单
    private async findOne(inboundid: number) {
        return await this.inboundEntity.findOne(inboundid);
    }

    //查询进仓单单头list
    public async find(findDto: FindInboundDto) {
        return await this.inboundEntity.find(findDto);
    }

    //新增进仓单
    public async createInbound(inboundDto: IInboundDto) {
        return this.mysqldbAls.sqlTransaction(async () => {
            //生成自动单号
            inboundDto.inboundcode = await this.autoCodeMxService.getAutoCode(inboundDto.inboundtype);
            //创建进仓单的单头
            const inbound = new Inbound(inboundDto);
            const createResult = await this.inboundEntity.create(inbound);
            //将单头信息填写到明细中
            for (let i = 0; i < inboundDto.inboundmx.length; i++) {
                inboundDto.inboundmx [i].inboundid = createResult.insertId;
                //如果明细没有客户，以单头客户为准
                if (inboundDto.inboundmx [i].clientid === 0) {
                    inboundDto.inboundmx [i].clientid = inbound.clientid;
                }
            }
            //创建进仓单的明细
            await this.inboundMxService.create(inboundDto.inboundmx);
        });
    }

    //修改进仓单的单头
    public async update(inboundDto: IInboundDto) {
        return this.mysqldbAls.sqlTransaction(async () => {
            //检查是否已经审核
            const inbound_db = await this.findOne(inboundDto.inboundid);
            if (inbound_db.level1review !== 0 && inbound_db.level2review !== 0) {
                return Promise.reject(new Error("修改失败，进仓单已审核，请先撤审"));
            }

            //创建进仓单的单头
            const inbound = new Inbound(inboundDto);
            await this.inboundEntity.update(inbound);

            //将单头信息填写到明细中
            for (let i = 0; i < inboundDto.inboundmx.length; i++) {
                inboundDto.inboundmx [i].inboundid = inboundDto.inboundid;
                //如果明细没有客户，以单头客户为准
                if (inboundDto.inboundmx [i].clientid === 0) {
                    inboundDto.inboundmx [i].clientid = inbound.clientid;
                }
            }

            //删除现有明细
            await this.inboundMxService.delete_date(inbound.inboundid);
            //创建进仓单的明细
            await this.inboundMxService.create(inboundDto.inboundmx);
        });
    }

    public async delete_data(inboundid: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async () => {
            //检查是否已经审核
            const inbound_db = await this.findOne(inboundid);
            if (inbound_db.level1review !== 0 && inbound_db.level2review !== 0) {
                return Promise.reject(new Error("删除失败，进仓单已审核，请先撤审"));
            }
            //填写删除人信息
            inbound_db.del_uuid = inbound_db.inboundid;
            inbound_db.deleter = userName;
            inbound_db.deletedAt = new Date();
            //更新进仓单为已删除
            await this.inboundEntity.update(inbound_db);
        });
    }

    public async undelete_data(inboundid: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            //检查是否已经审核
            const inbound_db = await this.findOne(inboundid);
            if (inbound_db.del_uuid === inbound_db.inboundid && inbound_db.deleter.length > 0) {
                return Promise.reject(new Error("取消删除失败，进仓单未删除"));
            }
            //取消填写删除人信息
            inbound_db.del_uuid = 0;
            inbound_db.deleter = "";
            inbound_db.deletedAt = null;
            //更新进仓单为已删除
            await this.inboundEntity.update(inbound_db);
        });
    }

    public async level1Review(inboundid: number, userName: string) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            //获取需要审核的单头
            const inbound = await this.findOne(inboundid);

            if (inbound.level1review !== 0 && inbound.level2review !== 0) {
                return Promise.reject(new Error("单据已审核"));
            }

            inbound.level1review = 1;
            inbound.level1date = new Date();
            inbound.level1name = userName;

            await this.inboundEntity.update(inbound);

            //获取需要进仓的明细
            const inboundmxList = await this.inboundMxService.find_entity(inboundid);
            for (let i = 0; i < inboundmxList.length; i++) {
                const inboundmx = inboundmxList[i];
                const inventory = new AddInventoryDto();
                inventory.productid = inboundmx.productid;
                inventory.spec_d = inboundmx.spec_d;
                inventory.materials_d = inboundmx.materials_d;
                inventory.remark = inboundmx.remark;
                inventory.remarkmx = inboundmx.remarkmx;
                inventory.qty = inboundmx.inqty;
                inventory.updatedAt = new Date();
                inventory.updater = userName
                inventory.latest_sale_price = inboundmx.netprice;
                inventory.clientid = inboundmx.clientid;

                if (inventory.clientid === 0) {
                    inventory.clientid = inbound.clientid;
                }
                inventory.warehouseid = inbound.warehouseid;

                //进仓每个明细
                await this.inventoryService.addInventory(inventory);
            }
        });
    }

    public async unLevel1Review(inboundid: number, userName: string) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            //获取需要撤审的单头
            const inbound = await this.findOne(inboundid);

            if ((inbound.level1review + inbound.level2review) !== 1) {
                return Promise.reject(new Error("单据已审核"));
            }

            inbound.level1review = 0;
            inbound.level1date = null;
            inbound.level1name = "";

            await this.inboundEntity.update(inbound);

            //获取需要扣减的明细
            const inboundmxList = await this.inboundMxService.find_entity(inboundid);
            for (let i = 0; i < inboundmxList.length; i++) {
                const inboundmx = inboundmxList[i];
                const intoTheWarehouseDto = new AddInventoryDto();
                intoTheWarehouseDto.productid = inboundmx.productid;
                intoTheWarehouseDto.spec_d = inboundmx.spec_d;
                intoTheWarehouseDto.materials_d = inboundmx.materials_d;
                intoTheWarehouseDto.remark = inboundmx.remark;
                intoTheWarehouseDto.remarkmx = inboundmx.remarkmx;
                intoTheWarehouseDto.qty = inboundmx.inqty
                intoTheWarehouseDto.updatedAt = new Date();
                intoTheWarehouseDto.updater = userName;
                intoTheWarehouseDto.latest_sale_price = inboundmx.netprice;
                intoTheWarehouseDto.clientid = inboundmx.clientid;

                if (inboundmx.clientid === 0) {
                    intoTheWarehouseDto.clientid = inbound.clientid;
                }
                intoTheWarehouseDto.warehouseid = inbound.warehouseid;

                //出仓每个明细
                await this.inventoryService.subtractInventory(intoTheWarehouseDto);
            }
        });
    }

    public async level2Review(inboundId: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async () => {
            //查询单头信息
            const inbound = await this.findOne(inboundId);
            //验证单头状态是否可以财务审核
            if (inbound.level1review !== 1 && inbound.level2review !== 0 && inbound.del_uuid !== 0) {
                return Promise.reject(new Error("财务审核失败，单据未审核"));
            }

            //更新单头
            inbound.level2review = 1;
            inbound.level2name = userName;
            inbound.level2date = new Date();
            await this.inboundEntity.update(inbound);

            //根据进仓单明细计算应付金额
            const inboundMxList = await this.inboundMxService.find(inbound.inboundid);
            let originalAmount: number = 0;
            for (let i = 0; i < inboundMxList.length; i++) {
                const inboundMxAmount = Number(mathjs.chain(mathjs.bignumber(inboundMxList[i].priceqty)).multiply(mathjs.bignumber(inboundMxList[i].netprice)));
                originalAmount = originalAmount + inboundMxAmount
            }

            //新增应付账款记录
            const createAccountsPayableResult = await this.accountsPayableService.create({
                accountsPayableId: 0,
                inDate: inbound.indate,
                buyid: inbound.buyid,
                amounts: originalAmount,
                checkedAmounts: 0,
                notCheckAmounts: originalAmount,
                correlationId: inbound.inboundid,
                correlationType: inbound.inboundtype,
                creater: userName,
                createdAt: new Date(),
                updater: "",
                updatedAt: null,
                deleter: "",
                del_uuid: 0,
                deletedAt: null,
            });

            //增加应付记录明细
            await this.accountsPayableMxService.create({
                inDate: new Date(),
                accountsPayableId: createAccountsPayableResult.insertId,
                accountsPayableMxId: 0,
                accountPayable: originalAmount,
                actuallyPayment: 0,
                advancesPayment: 0,
                correlationId: inbound.inboundid,
                correlationType: inbound.inboundtype,
                creater: userName,
                createdAt: new Date(),
                updater: "",
                updatedAt: null,
                reMark: "",
                abstract: ""
            })
        })
    }

    public async unLevel2Review(inboundId: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async () => {
            //查询单头信息
            const inbound = await this.findOne(inboundId);
            //检查单头状态是否可以撤销审核
            if (inbound.level1review !== 1 && inbound.level2review !== 1 && inbound.del_uuid !== 0) {
                return Promise.reject(new Error("财务撤审失败，单据未财务撤审"));
            }

            //更新单头信息
            inbound.level2review = 0;
            inbound.level2name = "";
            inbound.level2date = null;
            await this.inboundEntity.update(inbound);

            //检查应付账款是否已经核销
            const accountsPayableList = await this.accountsPayableService.find({
                accountsPayableId: 0,
                buyid: inbound.buyid,
                correlationId: inbound.inboundid,
                correlationType: inbound.inboundtype,
                startDate: "",
                endDate: "",
                page: 0,
                pagesize: 0
            })

            //查询应付账款
            if (accountsPayableList.length > 0 && accountsPayableList[0]) {
                const accountsPayable = accountsPayableList[0];
                if (accountsPayable.checkedAmounts > 0) {
                    //删除应付账款
                    await this.accountsPayableService.delete_data(accountsPayable.accountsPayableId, userName);
                    await this.accountsPayableMxService.deleteById(accountsPayable.accountsPayableId);
                } else {
                    return Promise.reject(new Error('财务撤审失败，应付账款已有核销记录'))
                }
            } else {
                return Promise.reject(new Error('财务撤审失败,查询应付账款记录失败'));
            }

        })
    }

}