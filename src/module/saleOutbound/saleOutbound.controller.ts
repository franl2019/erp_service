import {Body, Controller, Post} from "@nestjs/common";
import {SaleOutboundService} from "./saleOutbound.service";
import {ReqState, IState} from "../../decorator/user.decorator";
import {FindOutboundDto} from "../outbound/dto/find.dto";
import {DeleteOutboundDto} from "../outbound/dto/deleteOutbound.dto";
import {Level1ReviewSaleOutboundDto} from "./dto/level1ReviewSaleOutbound.dto";
import {Level2ReviewSaleOutboundDto} from "./dto/level2ReviewSaleOutbound.dto";
import {SaleOutboundCreateDto} from "./dto/saleOutboundCreate.dto";
import {SaleOutboundUpdateDto} from "./dto/saleOutboundUpdate.dto";

@Controller('erp/saleOutbound')
export class SaleOutboundController {

    constructor(private readonly saleOutboundService: SaleOutboundService) {
    }

    @Post("find")
    public async find(@Body() findOutbound: FindOutboundDto, @ReqState() state: IState) {
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

    @Post("findSheetState")
    public async findSheetState(@Body() findOutbound: FindOutboundDto, @ReqState() state: IState) {
        if (findOutbound.warehouseids.length === 0) {
            findOutbound.warehouseids = state.user.warehouseids;
        }

        if (findOutbound.operateareaids.length === 0) {
            findOutbound.operateareaids = state.user.client_operateareaids;
        }
        const sheetCompleteState = await this.saleOutboundService.findSheetState(findOutbound);
        return {
            code: 200,
            msg: "查询成功",
            sheetCompleteState
        };
    }

    @Post("create")
    public async create(@Body() saleOutboundCreateDto: SaleOutboundCreateDto, @ReqState() state: IState) {
        saleOutboundCreateDto.creater = state.user.username;
        saleOutboundCreateDto.createdAt = new Date();
        const createResult = await this.saleOutboundService.create(saleOutboundCreateDto);
        return {
            code: 200,
            msg: "保存成功",
            createResult
        };
    }

    @Post("create_l1Review")
    public async create_l1Review(@Body() saleOutboundCreateDto: SaleOutboundCreateDto, @ReqState() state: IState) {
        saleOutboundCreateDto.creater = state.user.username;
        saleOutboundCreateDto.createdAt = new Date();
        const createResult = await this.saleOutboundService.create_l1Review(saleOutboundCreateDto, state.user.username);
        return {
            code: 200,
            msg: "保存成功",
            createResult
        };
    }

    @Post("update")
    public async update(@Body() saleOutboundUpdateDto: SaleOutboundUpdateDto, @ReqState() state: IState) {
        saleOutboundUpdateDto.updater = state.user.username;
        saleOutboundUpdateDto.updatedAt = new Date();
        await this.saleOutboundService.update(saleOutboundUpdateDto, state);
        return {
            code: 200,
            msg: "更新成功"
        };
    }

    @Post("updateAndL1Review")
    public async updateAndL1Review(@Body() saleOutboundUpdateDto: SaleOutboundUpdateDto, @ReqState() state: IState) {
        saleOutboundUpdateDto.updater = state.user.username;
        saleOutboundUpdateDto.updatedAt = new Date();
        await this.saleOutboundService.updateAndL1Review(saleOutboundUpdateDto, state);
        return {
            code: 200,
            msg: "更新加审核成功"
        };
    }

    @Post("delete_data")
    public async delete_data(@Body() deleteDto: DeleteOutboundDto, @ReqState() state: IState) {
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
    public async level1Review(@Body() level1ReviewSaleOutboundDto: Level1ReviewSaleOutboundDto, @ReqState() state: IState) {
        await this.saleOutboundService.level1Review(level1ReviewSaleOutboundDto.outboundid, state.user.username);
        return {
            code: 200,
            msg: "审核成功"
        };
    }

    @Post("unL1Review")
    public async unLevel1Review(@Body() level1ReviewSaleOutboundDto: Level1ReviewSaleOutboundDto, @ReqState() state: IState) {
        await this.saleOutboundService.unLevel1Review(level1ReviewSaleOutboundDto.outboundid, state);
        return {
            code: 200,
            msg: "撤审成功"
        };
    }

    @Post("l2Review")
    public async level2Review(@Body() level2ReviewSaleOutboundDto: Level2ReviewSaleOutboundDto, @ReqState() state: IState) {
        await this.saleOutboundService.level2Review(level2ReviewSaleOutboundDto.outboundid, state.user.username);
        return {
            code: 200,
            msg: "审核成功"
        };
    }

    @Post("unL2Review")
    public async unLevel2Review(@Body() level2ReviewSaleOutboundDto: Level2ReviewSaleOutboundDto, @ReqState() state: IState) {
        await this.saleOutboundService.unLevel2Review(level2ReviewSaleOutboundDto.outboundid);
        return {
            code: 200,
            msg: "撤审成功"
        };
    }
}