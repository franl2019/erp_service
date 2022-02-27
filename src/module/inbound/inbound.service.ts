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

@Injectable()
export class InboundService {
    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly inboundEntity: InboundEntity,
        private readonly inboundMxService: Inbound_mxService,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly inventoryService: InventoryService
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
            //进仓单单头修改
            const inbound = await this.findOne(inboundId);
            if (inbound.level1review !== 1) {
                return Promise.reject(new Error("财务审核失败，单据未审核"));
            }
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

            //增加应付账款
            // const accountsPayable = new AccountsPayable({
            //     accountsPayableId: 0,
            //     buyid: inbound.buyid,
            //     occurrenceDate: inbound.indate,
            //     originalAmount: originalAmount,
            //     payableAmount: originalAmount,
            //     unPaidAmount: originalAmount,
            //     paidAmount: 0,
            //     payableType: 1,
            //     creater: userName,
            //     createdAt: new Date(),
            //     updater: "",
            //     updatedAt: null,
            //     inboundid: inbound.inboundid,
            // });
            // return await this.accountsPayableService.create([accountsPayable]);
        })
    }

    public async unLevel2Review(inboundId: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            // const accountsPayable = await this.accountsPayableService.findByInboundId(inboundId);
            // if(accountsPayable.paidAmount !== 0){
            //     return Promise.reject(new Error('撤销财务审核失败，进仓单已存在采购付款单'))
            // }
            // await this.accountsPayableService.delete_data(accountsPayable.accountsPayableId);

            //进仓单单头修改
            const inbound = await this.findOne(inboundId);
            if (inbound.level2review !== 1) {
                return Promise.reject(new Error("财务撤审失败，单据未财务撤审"));
            }
            inbound.level2review = 0;
            inbound.level2name = "";
            inbound.level2date = null;
            await this.inboundEntity.update(inbound);
        })
    }

}