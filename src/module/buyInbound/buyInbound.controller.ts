import {Body, Controller, Post} from "@nestjs/common";
import {BuyInboundService} from "./buyInbound.service";
import {ReqState} from "../../decorator/user.decorator";
import {State} from "../../interface/IState";
import {BuyInboundDto} from "./dto/buyInbound.dto";
import {DeleteBuyInboundDto} from "./dto/deleteBuyInbound.dto";
import {Level1ReviewBuyInboundDto} from "./dto/level1ReviewBuyInbound.dto";
import {FindBuyInboundDto} from "./dto/findBuyInbound.dto";
import {BuyInboundLevel2ReviewDto} from "./dto/BuyInboundLevel2Review.dto";
import {CodeType} from "../autoCode/codeType";

@Controller('erp/buyInbound')
export class BuyInboundController {

    constructor(private readonly buyInboundService: BuyInboundService) {
    }

    @Post("find")
    public async select(@Body() findInboundDto: FindBuyInboundDto, @ReqState() state: State) {
        if (findInboundDto.warehouseids.length === 0) {
            findInboundDto.warehouseids = state.user.warehouseids;
        }

        if (findInboundDto.operateareaids.length === 0) {
            findInboundDto.operateareaids = state.user.buy_operateareaids;
        }

        findInboundDto.inboundtype = CodeType.buyInbound;
        const data = await this.buyInboundService.find(findInboundDto);
        return {
            code: 200,
            msg: "查询成功",
            data
        };
    }

    @Post('findSheetCompleteState')
    public async findSheetCompleteState(@Body() findInboundDto: FindBuyInboundDto, @ReqState() state: State){
        if (findInboundDto.warehouseids.length === 0) {
            findInboundDto.warehouseids = state.user.warehouseids;
        }

        if (findInboundDto.operateareaids.length === 0) {
            findInboundDto.operateareaids = state.user.buy_operateareaids;
        }
        findInboundDto.inboundtype = CodeType.buyInbound;
        const sheetCompleteState = await this.buyInboundService.findBuyInboundState(findInboundDto);
        return {
            code: 200,
            msg: "查询成功",
            sheetCompleteState
        }
    }

    @Post("create")
    public async create(@Body() buyInboundDto: BuyInboundDto, @ReqState() state: State) {
        buyInboundDto.inboundtype = CodeType.buyInbound;
        buyInboundDto.creater = state.user.username;
        buyInboundDto.createdAt = new Date();

        const createResult = await this.buyInboundService.create(buyInboundDto);
        return {
            code: 200,
            msg: "保存成功",
            createResult
        };
    }

    @Post("create_l1Review")
    public async create_l1Review(@Body() buyInboundDto: BuyInboundDto, @ReqState() state: State) {
        buyInboundDto.inboundtype = CodeType.buyInbound;
        buyInboundDto.creater = state.user.username;
        buyInboundDto.createdAt = new Date();

        const createResult = await this.buyInboundService.create_l1Review(buyInboundDto);
        return {
            code: 200,
            msg: "保存成功,审核成功",
            createResult
        };
    }

    @Post("update")
    public async update(@Body() buyInboundDto: BuyInboundDto, @ReqState() state: State) {
        buyInboundDto.inboundtype = CodeType.buyInbound;
        buyInboundDto.updater = state.user.username;
        buyInboundDto.updatedAt = new Date();

        await this.buyInboundService.update(buyInboundDto);
        return {
            code: 200,
            msg: "更新成功"
        };
    }

    @Post("update_l1Review")
    public async update_l1Review(@Body() buyInboundDto: BuyInboundDto, @ReqState() state: State) {
        buyInboundDto.inboundtype = CodeType.buyInbound;
        buyInboundDto.updater = state.user.username;
        buyInboundDto.updatedAt = new Date();

        await this.buyInboundService.update_l1Review(buyInboundDto);
        return {
            code: 200,
            msg: "更新成功,审核成功"
        };
    }

    @Post("delete")
    public async delete_data(@Body() deleteDto: DeleteBuyInboundDto, @ReqState() state: State) {
        await this.buyInboundService.delete_data(deleteDto.inboundid, state.user.username);
        return {
            code: 200,
            msg: "删除成功"
        };
    }

    @Post("unDelete")
    public async undelete_data(@Body() deleteDto: DeleteBuyInboundDto) {
        await this.buyInboundService.unDelete_data(deleteDto.inboundid);
        return {
            code: 200,
            msg: "取消删除成功"
        };
    }

    @Post("level1Review")
    public async level1Review(@Body() l1RInboundDto: Level1ReviewBuyInboundDto, @ReqState() state: State) {
        await this.buyInboundService.level1Review(l1RInboundDto.inboundid, state.user.username);
        return {
            code: 200,
            msg: "审核成功"
        };
    }

    @Post("unLevel1Review")
    public async unLevel1Review(@Body() l1RInboundDto: Level1ReviewBuyInboundDto, @ReqState() state: State) {
        await this.buyInboundService.unLevel1Review(l1RInboundDto.inboundid, state.user.username);
        return {
            code: 200,
            msg: "撤审成功"
        };
    }

    @Post("level2Review")
    public async level2Review(@Body() buyInboundLevel2ReviewDto: BuyInboundLevel2ReviewDto, @ReqState() state: State) {
        await this.buyInboundService.level2Review(buyInboundLevel2ReviewDto.inboundid, state.user.username);
        return {
            code: 200,
            msg: "财务审核成功"
        };
    }

    @Post("unLevel2Review")
    public async unLevel2Review(@Body() buyInboundLevel2ReviewDto: BuyInboundLevel2ReviewDto) {
        await this.buyInboundService.unLevel2Review(buyInboundLevel2ReviewDto.inboundid);
        return {
            code: 200,
            msg: "财务撤审成功"
        };
    }
}