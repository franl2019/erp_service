import {Injectable} from "@nestjs/common";
import {OutboundService} from "../outbound/outbound.service";
import {SaleOutboundFindDto} from "./dto/saleOutboundFind.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {SaleOutboundCreateDto} from "./dto/saleOutboundCreate.dto";
import {SaleOutboundUpdateDto} from "./dto/saleOutboundUpdate.dto";

@Injectable()
export class SaleOutboundService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly outboundService: OutboundService,
    ) {
    }

    public async find(findDto: SaleOutboundFindDto) {
        return await this.outboundService.find(findDto);
    }

    public async findSheetState(findDto: SaleOutboundFindDto) {
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

    public async create(saleOutboundDto: SaleOutboundCreateDto, userName: string, clientOperateareaids: number[]) {
        return await this.outboundService.create(
            saleOutboundDto,
            userName,
            clientOperateareaids
        )
    }

    public async createL1Review(saleOutboundDto: SaleOutboundCreateDto, userName: string, clientOperateareaids: number[]) {
        return await this.outboundService.createL1Review(
            saleOutboundDto,
            userName,
            clientOperateareaids
        );
    }

    public async update(saleOutboundDto: SaleOutboundUpdateDto, userName: string, clientOperateareaids: number[]) {
        return await this.outboundService.update(
            saleOutboundDto,
            userName,
            clientOperateareaids
        );
    }

    public async updateL1Review(saleOutboundDto: SaleOutboundUpdateDto, userName: string, clientOperateareaids: number[]) {
        return await this.outboundService.updateL1Review(
            saleOutboundDto,
            userName,
            clientOperateareaids
        )
    }

    public async delete_data(outboundId: number, userName: string) {
        return await this.outboundService.delete_data(outboundId, userName);
    }

    public async unDeleteData(outboundId: number) {
        return await this.outboundService.undelete_data(outboundId);
    }

    public async level1Review(outboundId: number, userName: string) {
        return await this.outboundService.l1Review(outboundId, userName);
    }

    public async unLevel1Review(outboundId: number, userName: string) {
        return await this.outboundService.unL1Review(outboundId, userName);
    }

    public async level2Review(outboundId: number, userName: string) {
        return await this.outboundService.l2Review(outboundId, userName);
    }

    public async unLevel2Review(outboundId: number) {
        return await this.outboundService.unL2Review(outboundId);

    }
}