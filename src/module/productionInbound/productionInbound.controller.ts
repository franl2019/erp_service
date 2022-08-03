import {Body, Controller, Post} from "@nestjs/common";
import {FindInboundDto} from "../inbound/dto/findInbound.dto";
import {ReqState, IState} from "../../decorator/user.decorator";
import {InboundDto} from "../inbound/dto/Inbound.dto";
import {L1RInboundDto} from "../inbound/dto/L1RInbound.dto";
import {ProductionInboundService} from "./productionInbound.service";
import {DeleteProductInboundDto} from "./dto/deleteProductInbound.dto";

@Controller('erp/production_inbound')
export class ProductionInboundController {

    constructor(private readonly productionInboundService: ProductionInboundService) {
    }

    @Post("select")
    public async select(@Body() findInboundDto: FindInboundDto, @ReqState() state: IState) {
        if (findInboundDto.warehouseids.length === 0) {
            findInboundDto.warehouseids = state.user.warehouseids;
        }

        if (findInboundDto.operateareaids.length === 0) {
            findInboundDto.operateareaids = state.user.client_operateareaids;
        }

        findInboundDto.inboundtype = 2;

        const data = await this.productionInboundService.find(findInboundDto);
        return {
            code: 200,
            msg: "查询成功",
            data
        };
    }

    @Post("add")
    public async add(@Body() inboundDto: InboundDto, @ReqState() state: IState) {

        inboundDto.inboundtype = 2;
        inboundDto.creater = state.user.username;
        inboundDto.createdAt = new Date();

        await this.productionInboundService.create(inboundDto);
        return {
            code: 200,
            msg: "新增成功"
        };
    }

    @Post("update")
    public async update(@Body() inboundDto: InboundDto, @ReqState() state: IState) {

        inboundDto.inboundtype = 2;
        inboundDto.updater = state.user.username;
        inboundDto.updatedAt = new Date();

        await this.productionInboundService.update(inboundDto);

        return {
            code: 200,
            msg: "更新成功"
        };
    }

    @Post("delete")
    public async delete_data(@Body() deleteDto: DeleteProductInboundDto, @ReqState() state: IState) {
        await this.productionInboundService.delete_data(deleteDto.inboundid, state.user.username);
        return {
            code: 200,
            msg: "删除成功"
        };
    }

    @Post("undelete")
    public async undelete_data(@Body() deleteDto: DeleteProductInboundDto) {
        await this.productionInboundService.unDelete_data(deleteDto.inboundid);
        return {
            code: 200,
            msg: "取消删除成功"
        };
    }

    @Post("level1Review")
    public async level1Review(@Body() l1RInboundDto: L1RInboundDto, @ReqState() state: IState) {
        await this.productionInboundService.level1Review(l1RInboundDto.inboundid, state.user.username);
        return {
            code: 200,
            msg: "审核成功"
        };
    }

    @Post("unLevel1Review")
    public async unLevel1Review(@Body() l1RInboundDto: L1RInboundDto, @ReqState() state: IState) {
        await this.productionInboundService.unLevel1Review(l1RInboundDto.inboundid, state.user.username);
        return {
            code: 200,
            msg: "撤审成功"
        };
    }
}