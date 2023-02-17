import {SaleOrderEntity} from "./saleOrder.entity";
import {Injectable} from "@nestjs/common";
import {SaleOrderFindDto} from "./dto/saleOrderFind.dto";
import {ISaleOrder} from "./saleOrder";
import {SaleOrderMxService} from "../saleOrderMx/saleOrderMx.service";
import {SaleOrderCreateDto} from "./dto/saleOrderCreate.dto";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {CodeType} from "../autoCode/codeType";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {SaleOrderUpdateDto} from "./dto/saleOrderUpdate.dto";

@Injectable()
export class SaleOrderService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly saleOrderEntity: SaleOrderEntity,
        private readonly saleOrderMxService: SaleOrderMxService,
        private readonly autoCodeMxService: AutoCodeMxService
    ) {
    }

    public async findOne(saleOrderId: number) {
        return await this.saleOrderEntity.findOne(saleOrderId)
    }

    public async find(findDto: SaleOrderFindDto) {
        return await this.saleOrderEntity.find(findDto);
    }

    private async create(saleOrder: ISaleOrder) {
        return await this.saleOrderEntity.create(saleOrder)
    }

    private async update(saleOrder: ISaleOrder) {
        return await this.saleOrderEntity.update(saleOrder);
    }

    public async createSheet(saleOrderCreateSheet: SaleOrderCreateDto) {
        return await this.mysqldbAls.sqlTransaction<SaleOrderCreateDto>(async () => {
            //创建单号
            saleOrderCreateSheet.saleOrderCode = await this.autoCodeMxService.getSheetAutoCode(CodeType.saleOrder)

            const createSheetHeadResult = await this.create(saleOrderCreateSheet);
            saleOrderCreateSheet.saleOrderId = createSheetHeadResult.insertId;

            if (saleOrderCreateSheet.saleOrderMx.length > 0) {
                const saleOrderId = createSheetHeadResult.insertId;
                //set saleOrderId
                for (let i = 0; i < saleOrderCreateSheet.saleOrderMx.length; i++) {
                    saleOrderCreateSheet.saleOrderMx[i].saleOrderId = saleOrderId;
                }

                await this.saleOrderMxService.create(saleOrderCreateSheet.saleOrderMx);
            }

            return saleOrderCreateSheet
        })
    }

    public async createSheetAndL1Review(saleOrderCreateSheet: SaleOrderCreateDto) {
        return await this.mysqldbAls.sqlTransaction<SaleOrderCreateDto>(async () => {
            await this.createSheet(saleOrderCreateSheet);
            await this.l1Review(saleOrderCreateSheet.saleOrderId, saleOrderCreateSheet.creater);
            return saleOrderCreateSheet
        })
    }

    public async updateSheet(saleOrderUpdateDto: SaleOrderUpdateDto) {
        return await this.mysqldbAls.sqlTransaction<SaleOrderUpdateDto>(async () => {
            await this.update(saleOrderUpdateDto);
            await this.saleOrderMxService.delete_data(saleOrderUpdateDto.saleOrderId);
            await this.saleOrderMxService.create(saleOrderUpdateDto.saleOrderMx);
            return saleOrderUpdateDto
        })
    }

    public async updateSheetAndL1Review(saleOrderUpdateDto: SaleOrderUpdateDto) {
        return await this.mysqldbAls.sqlTransaction<SaleOrderUpdateDto>(async () => {
            await this.updateSheet(saleOrderUpdateDto);
            await this.l1Review(saleOrderUpdateDto.saleOrderId, saleOrderUpdateDto.updater);
            return saleOrderUpdateDto
        })
    }

    public async l1Review(saleOrderId: number, username: string) {
        return await this.saleOrderEntity.l1Review(saleOrderId, username);
    }

    public async unl1Review(saleOrderId: number) {
        return await this.saleOrderEntity.unl1Review(saleOrderId);
    }

    public async l2Review(saleOrderId: number, username: string) {
        return await this.saleOrderEntity.l2Review(saleOrderId, username);
    }

    public async unl2Review(saleOrderId: number) {
        return await this.saleOrderEntity.unl2Review(saleOrderId);
    }

    public async stopReview(saleOrderId: number, username: string) {
        return await this.saleOrderEntity.stopReview(saleOrderId, username);
    }

    public async unStopReview(saleOrderId: number) {
        return await this.saleOrderEntity.unStopReview(saleOrderId);
    }

    public async manualFinishReview(saleOrderId: number, username: string) {
        return await this.saleOrderEntity.manualFinishReview(saleOrderId, username);
    }

    public async unManualFinishReview(saleOrderId: number) {
        return await this.saleOrderEntity.unManualFinishReview(saleOrderId);
    }

    public async urgentReview(saleOrderId: number, username: string) {
        return await this.saleOrderEntity.urgentReview(saleOrderId, username);
    }

    public async unUrgentReview(saleOrderId: number) {
        return await this.saleOrderEntity.unUrgentReview(saleOrderId);
    }

    public async delete_data(saleOrderId: number, username: string) {
        return await this.saleOrderEntity.delete_data(saleOrderId, username)
    }
}