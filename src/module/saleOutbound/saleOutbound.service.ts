import {Injectable} from "@nestjs/common";
import {OutboundService} from "../outbound/outbound.service";
import {FindSaleOutboundDto} from "./dto/findSaleOutbound.dto";
import {SaleOutboundDto} from "./dto/saleOutbound.dto";
import {IState} from "../../interface/IState";

@Injectable()
export class SaleOutboundService {

    constructor(private readonly outboundService: OutboundService) {
    }

    public async find(findDto: FindSaleOutboundDto) {
        findDto.outboundtype = 8;
        return await this.outboundService.find(findDto);
    }

    public async create(saleOutboundDto: SaleOutboundDto, state: IState) {
        saleOutboundDto.outboundtype = 8;
        return await this.outboundService.createOutbound(saleOutboundDto, state);
    }

    public async update(saleOutboundDto: SaleOutboundDto, state: IState) {
        saleOutboundDto.outboundtype = 8;
        return await this.outboundService.editOutbound(saleOutboundDto, state);
    }

    public async delete_data(outboundId: number, state: IState) {
        return await this.outboundService.delete_data(outboundId, state);
    }

    public async unDelete_data(outboundId: number) {
        return await this.outboundService.undelete_data(outboundId);
    }

    public async level1Review(outboundId: number, state: IState) {
        return await this.outboundService.l1Review(outboundId, state);
    }

    public async unLevel1Review(outboundId: number, state: IState) {
        return await this.outboundService.unL1Review(outboundId, state);
    }
}