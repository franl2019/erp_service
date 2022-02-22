import {Injectable} from "@nestjs/common";
import {InboundService} from "../inbound/inbound.service";
import {FindProductionInboundDto} from "./dto/findProductionInbound.dto";
import {ProductionInboundDto} from "./dto/productionInbound.dto";

@Injectable()
export class ProductionInboundService {

    constructor(
        private readonly inboundService: InboundService,
    ) {
    }

    public async find(findDto: FindProductionInboundDto) {
        return await this.inboundService.find(findDto);
    }

    public async create(productionInbound: ProductionInboundDto) {
        return await this.inboundService.createInbound(productionInbound);
    }

    public async update(productionInbound: ProductionInboundDto) {
        return await this.inboundService.update(productionInbound);
    }

    public async delete_data(inboundid: number, userName: string) {
        return await this.inboundService.delete_data(inboundid, userName);
    }

    public async unDelete_data(inboundid: number) {
        return await this.inboundService.undelete_data(inboundid);
    }

    public async level1Review(inboundid: number, userName: string) {
        return await this.inboundService.level1Review(inboundid, userName);
    }

    public async unLevel1Review(inboundid: number,userName:string) {
        return await this.inboundService.unLevel1Review(inboundid,userName);
    }
}