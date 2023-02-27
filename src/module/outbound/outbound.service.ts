import {Injectable} from "@nestjs/common";
import {OutboundEntity} from "./outbound.entity";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {OutboundMxService} from "../outboundMx/outboundMx.service";
import {InventoryService} from "../inventory/inventory.service";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {WeightedAverageRecordService} from "../weightedAverageRecord/weightedAverageRecord.service";
import * as moment from "moment";
import {OutboundFindDto} from "./dto/outboundFind.dto";
import {OutboundCreateDto} from "./dto/outboundCreate.dto";
import {IOutbound, OutboundSheet} from "./outbound";
import {OutboundUpdateDto} from "./dto/outboundUpdate.dto";
import {AccountsReceivableService} from "../accountsReceivable/accountsReceivable.service";

@Injectable()
export class OutboundService {

    constructor(
        private readonly mysqlAls: MysqldbAls,
        private readonly outboundEntity: OutboundEntity,
        private readonly outboundMxService: OutboundMxService,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly inventoryService: InventoryService,
        private readonly accountsReceivableService: AccountsReceivableService,
        private readonly weightedAverageRecordService: WeightedAverageRecordService,
    ) {
    }

    //查询单头
    public async find(findDto: OutboundFindDto) {
        return await this.outboundEntity.find(findDto);
    }

    public async findById(outboundId: number) {
        return await this.outboundEntity.findById(outboundId);
    }

    public async findMxById(outboundId: number) {
        return await this.outboundMxService.find(outboundId);
    }

    //创建出仓单
    public async create(outboundCreateDto: OutboundCreateDto, userName: string, clientOperateareaids: number[]): Promise<IOutbound> {
        //验证是否有客户操作区域
        if (!outboundCreateDto.isExistAuth(
            outboundCreateDto.operateareaid,
            clientOperateareaids
        )) return

        outboundCreateDto.creater = userName;
        outboundCreateDto.createdAt = new Date();
        return this.mysqlAls.sqlTransaction(async () => {
            //创建单号
            outboundCreateDto.outboundcode = await this.autoCodeMxService.getSheetAutoCode(outboundCreateDto.outboundtype);
            //创建单头
            const {insertId: outboundid} = await this.outboundEntity.create(outboundCreateDto);
            //将单头ID填写到明细中
            for (let i = 0; i < outboundCreateDto.outboundMx.length; i++) {
                outboundCreateDto.outboundMx[i].outboundid = outboundid;
            }
            //创建明细
            await this.outboundMxService.create(outboundCreateDto.outboundMx);

            outboundCreateDto.outboundid = outboundid;
            return outboundCreateDto
        });
    }

    //修改出仓单
    public async update(outboundUpdateDto: OutboundUpdateDto, userName: string, clientOperateareaids: number[]): Promise<IOutbound> {
        //验证是否有客户操作区域
        if (!outboundUpdateDto.isExistAuth(
            outboundUpdateDto.operateareaid,
            clientOperateareaids
        )) return

        //添加修改信息
        outboundUpdateDto.updater = userName;
        outboundUpdateDto.updatedAt = new Date();

        return this.mysqlAls.sqlTransaction(async () => {
            const outboundInDb = await this.outboundEntity.findById(outboundUpdateDto.outboundid);

            //检查是否已经审核
            if (outboundInDb.level1review !== 0 && outboundInDb.level2review !== 0) {
                return Promise.reject(new Error("出仓单已经审核，请先撤销审核"));
            }

            //修改单头
            await this.outboundEntity.update(outboundUpdateDto);
            //删除现有明细
            await this.outboundMxService.delete_data(outboundUpdateDto.outboundid);

            //为新明细添加出仓单ID
            const outboundMx = outboundUpdateDto.outboundMx;
            for (let i = 0; i < outboundMx.length; i++) {
                outboundMx[i].outboundid = outboundUpdateDto.outboundid;
            }

            //创建明细
            await this.outboundMxService.create(outboundMx);
            return outboundUpdateDto
        });
    }

    public async createL1Review(outboundCreateDto: OutboundCreateDto, userName: string, clientOperateareaids: number[]) {
        //验证是否有客户操作区域
        if (!outboundCreateDto.isExistAuth(
            outboundCreateDto.operateareaid,
            clientOperateareaids
        )) return

        return await this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.create(outboundCreateDto, userName, clientOperateareaids);
            await this.l1Review(outbound.outboundid, userName);
            return outbound
        })
    }

    public async updateL1Review(outboundUpdateDto: OutboundUpdateDto, userName: string, clientOperateareaids: number[]) {
        //验证是否有客户操作区域
        if (!outboundUpdateDto.isExistAuth(
            outboundUpdateDto.operateareaid,
            clientOperateareaids
        )) return

        return await this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.update(outboundUpdateDto, userName, clientOperateareaids);
            await this.l2Review(outbound.outboundid, userName);
            return outbound
        })
    }

    //删除出仓单
    public async delete_data(outboundId: number, userName: string) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findById(outboundId);
            //检查是否未删除
            if (outbound.del_uuid !== 0) {
                return Promise.reject(new Error("进仓单已删除，请勿重复删除"));
            }

            //检查是否已经审核
            if (outbound.level1review !== 0 && outbound.level2review !== 0) {
                return Promise.reject(new Error("出仓单已经审核，请先撤销审核"));
            }

            //删除出仓单
            await this.outboundEntity.delete_data(outbound.outboundid, userName);
        });
    }

    //取消删除出仓单
    public async undelete_data(outboundId: number) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outbound = await this.outboundEntity.findById(outboundId);

            //检查是否已经删除
            if (outbound.del_uuid === 0) {
                return Promise.reject(new Error("进仓单未删除，无法取消删除"));
            }

            //检查审核状态
            if (outbound.level1review !== 0 && outbound.level2review !== 0) {
                return Promise.reject(new Error("出仓单审核状态异常，联系管理员"));
            }

            //删除出仓单
            await this.outboundEntity.undelete_data(outbound.outboundid);
        });
    }

    //审核出仓单
    public async l1Review(outboundId: number, userName: string) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outboundSheet = await new OutboundSheet();
            outboundSheet.setOutboundValue(await this.outboundEntity.findById(outboundId));
            await outboundSheet.setOutboundMxListValue(await this.outboundMxService.findById(outboundId));

            if (!outboundSheet.isCanL1Review()) {
                return Promise.reject(new Error("审核失败,审核标记有误"));
            }
            await this.outboundEntity.l1Review(outboundSheet.outboundid, userName);
            await this.inventoryService.outboundSheetAddInventory(
                outboundSheet,
                userName
            );
        })
    }

    //撤审出仓单
    public async unL1Review(outboundId: number, userName: string) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outboundSheet = new OutboundSheet();
            outboundSheet.setOutboundValue(await this.outboundEntity.findById(outboundId));
            await outboundSheet.setOutboundMxListValue(await this.outboundMxService.findById(outboundId));

            //更新出仓单审核状态
            await this.outboundEntity.unl1Review(outboundSheet.outboundid);

            //扣减库存
            await this.inventoryService.outboundSheetSubtractInventory(
                outboundSheet,
                userName
            );
        })
    }

    //财务审核
    public async l2Review(outboundId: number, userName: string) {
        return this.mysqlAls.sqlTransaction(async () => {
            const outboundSheet = new OutboundSheet();
            outboundSheet.setOutboundValue(await this.findById(outboundId));
            await outboundSheet.setOutboundMxListValue(await this.findMxById(outboundId));

            if (!outboundSheet.isCanL2Review()) {
                return Promise.reject(new Error("审核失败,审核标记有误"));
            }

            //更新出仓单审核状态
            await this.outboundEntity.l2Review(outboundSheet.outboundid, userName);
            //增加应收账款
            await this.accountsReceivableService.outboundSheetCreateAccountsReceivable(outboundSheet);
            await this.weightedAverageRecordService.addVersionLatest(moment(outboundSheet.outdate).format('YYYY-MM'));
        })
    }

    //财务撤审
    public async unL2Review(outboundId: number) {
        return this.mysqlAls.sqlTransaction(async () => {

            const outboundSheet = new OutboundSheet();
            outboundSheet.setOutboundValue(await this.findById(outboundId));

            if (!outboundSheet.isCanUnL2Review()) {
                return Promise.reject(new Error("审核失败,审核标记有误"));
            }

            //更新出仓单审核状态
            await this.outboundEntity.unl2Review(outboundSheet.outboundid);
            //删除应收账款
            await this.accountsReceivableService.outboundSheetDeleteAccountsReceivable(
                outboundSheet.outboundid
            );
        });
    }

}