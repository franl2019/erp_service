import {Injectable} from "@nestjs/common";
import {InboundService} from "../inbound/inbound.service";
import {FindBuyInboundDto} from "./dto/findBuyInbound.dto";
import {BuyInboundDto} from "./dto/buyInbound.dto";

@Injectable()
export class BuyInboundService {

    constructor(
        private readonly inboundService: InboundService
    ) {
    }

    public async find(findDto: FindBuyInboundDto) {
        return await this.inboundService.find(findDto);
    }

    public async create(buyInboundDto: BuyInboundDto) {
        return await this.inboundService.createInbound(buyInboundDto);
    }

    public async update(buyInboundDto: BuyInboundDto) {
        return await this.inboundService.update(buyInboundDto);
    }

    public async delete_data(inboundId: number, userName: string) {
        return await this.inboundService.delete_data(inboundId, userName);
    }

    public async unDelete_data(inboundId: number) {
        return await this.inboundService.undelete_data(inboundId);
    }

    public async level1Review(inboundId: number, userName: string) {
        return await this.inboundService.level1Review(inboundId, userName);
    }

    public async unLevel1Review(inboundId: number, userName: string) {
        return await this.inboundService.unLevel1Review(inboundId, userName);
    }

    //财审
    public async level2Review(inboundId: number, userName: string) {
        return await this.inboundService.level2Review(inboundId, userName);
    }

    //撤销财审
    public async unLevel2Review(inboundId: number) {
        return await this.inboundService.unLevel2Review(inboundId);
    }
}