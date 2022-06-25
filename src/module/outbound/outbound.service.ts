import {Injectable} from "@nestjs/common";
import {OutboundEntity} from "./outbound.entity";
import {Outbound} from "./outbound";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IOutboundDto} from "./dto/outbound.dto";
import {OutboundMxService} from "../outboundMx/outboundMx.service";
import {State} from "../../interface/IState";
import {IFindOutboundDto} from "./dto/find.dto";
import {AddInventoryDto} from "../inventory/dto/addInventory.dto";
import {InventoryService} from "../inventory/inventory.service";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {ResultSetHeader} from "mysql2/promise";
import {WeightedAverageRecordService} from "../weightedAverageRecord/weightedAverageRecord.service";
import * as moment from "moment";

@Injectable()
export class OutboundService {

    constructor(
        private readonly mysqlAls: MysqldbAls,
        private readonly outboundEntity: OutboundEntity,
        private readonly outboundMxService: OutboundMxService,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly inventoryService: InventoryService,
        private readonly weightedAverageRecordService:WeightedAverageRecordService
    ) {
    }

    //查询单头
    public async find(findDto: IFindOutboundDto) {
        return await this.outboundEntity.find(findDto);
    }

    public async findById(outboundId: number) {
        return await this.outboundEntity.findById(outboundId);
    }

    public async findMxById(outboundId:number){
        return await this.outboundMxService.find(outboundId);
    }

    //创建出仓单
    public async create(createOutboundDto: IOutboundDto, username: string):Promise<ResultSetHeader> {
        return this.mysqlAls.sqlTransaction(async () => {
            //创建单号
            createOutboundDto.outboundcode = await this.autoCodeMxService.getSheetAutoCode(createOutboundDto.outboundtype);
            createOutboundDto.creater = username;
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
            return createResult
        });
    }

    //修改出仓单
    public async update(updateOutboundDto: IOutboundDto, state: State) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound_db = await this.outboundEntity.findById(updateOutboundDto.outboundid);

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

    //修改加审核
    public async updateAndL1Review(updateOutboundDto: IOutboundDto, state: State){
        return await this.mysqlAls.sqlTransaction(async ()=>{
           await this.update(updateOutboundDto,state);
           return await this.l1Review(updateOutboundDto.outboundid,state.user.username);
        })
    }

    //删除出仓单
    public async delete_data(outboundId: number, state: State) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findById(outboundId);
            //检查是否已经审核
            if (outbound.level1review !== 0 && outbound.level2review !== 0) {
                return Promise.reject(new Error("出仓单已经审核，请先撤销审核"));
            }

            //检查是否未删除
            if (outbound.del_uuid !== 0 && outbound.deleter.length > 0) {
                return Promise.reject(new Error("进仓单已删除，请勿重复删除"));
            }

            //修改出仓单
            await this.outboundEntity.delete_data(outbound.outboundid,state.user.username);
        });
    }

    //取消删除出仓单
    public async undelete_data(outboundId: number) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findById(outboundId);
            //检查审核状态
            if (outbound.level1review !== 0 && outbound.level2review !== 0) {
                return Promise.reject(new Error("出仓单审核状态异常，联系管理员"));
            }

            //检查是否已经删除
            if (outbound.del_uuid === 0 && outbound.deleter.length === 0) {
                return Promise.reject(new Error("进仓单未删除，无法取消删除"));
            }

            //修改出仓单
            await this.outboundEntity.undelete_data(outbound.outboundid);
        });
    }

    //审核出仓单
    public async l1Review(outboundId: number, userName:string) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findById(outboundId);
            //检查是否未审核
            if (outbound.level1review !== 0 && outbound.level2review !== 0) {
                return Promise.reject(new Error("审核失败,审核标记有误"));
            }

            //检查是否已经删除
            if (outbound.del_uuid !== 0 && outbound.deleter.length !== 0) {
                return Promise.reject(new Error("进仓单已删除，无法审核"));
            }

            await this.outboundEntity.l1Review(outbound.outboundid,userName);

            //扣减库存
            //获取需要进仓的明细
            const outboundMxList = await this.outboundMxService.findById(outbound.outboundid);
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
                inventory.updater = userName;
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
    public async unL1Review(outboundId: number, state: State) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findById(outboundId);
            //检查是否未审核
            if (outbound.level1review !== 1 && outbound.level2review !== 0) {
                return Promise.reject(new Error("审核失败,审核标记有误"));
            }

            //检查是否已经删除
            if (outbound.del_uuid !== 0 && outbound.deleter.length !== 0) {
                return Promise.reject(new Error("进仓单已删除，无法审核"));
            }

            //更新出仓单审核状态
            await this.outboundEntity.unl1Review(outbound.outboundid);

            //扣减库存
            //获取需要进仓的明细
            const outboundMxList = await this.outboundMxService.findById(outbound.outboundid);
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
            const outbound = await this.outboundEntity.findById(outboundId);
            //检查能否审核 仓审 = 1 财审 = 0 删除标记 = 0
            if (outbound.level1review !== 1 && outbound.level2review !== 0 && outbound.del_uuid !== 0) {
                return Promise.reject(new Error("审核失败,审核标记有误"));
            }

            //更新出仓单审核状态
            await this.outboundEntity.l2Review(outbound.outboundid,userName);
            await this.weightedAverageRecordService.addVersionLatest(moment(outbound.outdate).format('YYYY-MM'));
        })
    }

    //财务撤审
    public async unL2Review(outboundId: number) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findById(outboundId);

            //检查能否审核 仓审 = 1 财审 = 1 删除标记 = 0
            if (outbound.level1review !== 1 && outbound.level2review !== 1 && outbound.del_uuid !== 0) {
                return Promise.reject(new Error("审核失败,审核标记有误"));
            }

            //更新出仓单审核状态
            await this.outboundEntity.unl2Review(outbound.outboundid);
        });
    }

}