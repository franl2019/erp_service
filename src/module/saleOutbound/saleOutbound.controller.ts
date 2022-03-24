import {Body, Controller, Post} from "@nestjs/common";
import {SaleOutboundService} from "./saleOutbound.service";
import {ReqState} from "../../decorator/user.decorator";
import {State} from "../../interface/IState";
import {FindOutboundDto} from "../outbound/dto/find.dto";
import {OutboundDto} from "../outbound/dto/outbound.dto";
import {DeleteOutboundDto} from "../outbound/dto/deleteOutbound.dto";
import {Level1ReviewSaleOutboundDto} from "./dto/level1ReviewSaleOutbound.dto";
import {Level2ReviewSaleOutboundDto} from "./dto/level2ReviewSaleOutbound.dto";

@Controller('erp/saleOutbound')
export class SaleOutboundController {

    constructor(private readonly saleOutboundService: SaleOutboundService) {
    }

    @Post("find")
    public async select(@Body() findOutbound: FindOutboundDto, @ReqState() state: State) {
        if (findOutbound.warehouseids.length === 0) {
            findOutbound.warehouseids = state.user.warehouseids;
        }

        if (findOutbound.operateareaids.length === 0) {
            findOutbound.operateareaids = state.user.client_operateareaids;
        }
        const data = await this.saleOutboundService.find(findOutbound);
        return {
            code: 200,
            msg: "查询成功",
            data
        };
    }

    @Post("create")
    public async add(@Body() outboundDto: OutboundDto, @ReqState() state: State) {
        await this.saleOutboundService.create(outboundDto, state);
        return {
            code: 200,
            msg: "保存成功"
        };
    }

    @Post("update")
    public async update(@Body() outboundDto: OutboundDto, @ReqState() state: State) {
        await this.saleOutboundService.update(outboundDto, state);
        return {
            code: 200,
            msg: "更新成功"
        };
    }

    @Post("delete_data")
    public async delete_data(@Body() deleteDto: DeleteOutboundDto, @ReqState() state: State) {
        await this.saleOutboundService.delete_data(deleteDto.outboundid, state);
        return {
            code: 200,
            msg: "删除成功"
        };
    }

    @Post("undelete_data")
    public async undelete_data(@Body() deleteDto: DeleteOutboundDto) {
        await this.saleOutboundService.unDelete_data(deleteDto.outboundid);
        return {
            code: 200,
            msg: "取消删除成功"
        };
    }

    @Post("l1Review")
    public async level1Review(@Body() level1ReviewSaleOutboundDto: Level1ReviewSaleOutboundDto, @ReqState() state: State) {
        await this.saleOutboundService.level1Review(level1ReviewSaleOutboundDto.outboundid, state);
        return {
            code: 200,
            msg: "审核成功"
        };
    }

    @Post("unL1Review")
    public async unLevel1Review(@Body() level1ReviewSaleOutboundDto: Level1ReviewSaleOutboundDto, @ReqState() state: State) {
        await this.saleOutboundService.unLevel1Review(level1ReviewSaleOutboundDto.outboundid, state);
        return {
            code: 200,
            msg: "撤审成功"
        };
    }

    @Post("l2Review")
    public async level2Review(@Body() level2ReviewSaleOutboundDto: Level2ReviewSaleOutboundDto, @ReqState() state: State) {
        await this.saleOutboundService.level2Review(level2ReviewSaleOutboundDto.outboundid, state.user.username);
        return {
            code: 200,
            msg: "审核成功"
        };
    }

    @Post("unL2Review")
    public async unLevel2Review(@Body() level2ReviewSaleOutboundDto: Level2ReviewSaleOutboundDto, @ReqState() state: State) {
        await this.saleOutboundService.unLevel2Review(level2ReviewSaleOutboundDto.outboundid);
        return {
            code: 200,
            msg: "撤审成功"
        };
    }
}