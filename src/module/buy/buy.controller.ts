import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {AddBuyDto} from "./dto/addBuy.dto";
import {UpdateBuyDto} from "./dto/updateBuy.dto";
import {DeleteBuyDto} from "./dto/deleteBuy.dto";
import {BuyService} from "./buy.service";
import {ReqState, IState} from "../../decorator/user.decorator";
import {SelectBuyDto} from "./dto/selectBuy.dto";
import {L1reviewBuyDto} from "./dto/l1reviewBuy.dto";
import {L2reviewDto} from "./dto/l2review.dto";
import {FindOneBuyDto} from "./dto/findOneBuy.dto";
import {systemConfigFactoryGuard} from "../../guard/systemConfigFactory.guard";

@Controller("erp/buy")
export class BuyController {

    constructor(
        private readonly buyService: BuyService,
    ) {
    }

    @Post("findOne")
    async findOne(@Body() findOneDto:FindOneBuyDto) {
        const buy = await this.buyService.findOne(findOneDto.buyid);
        return {
            code: 200,
            msg: "查询成功",
            data:[buy]
        };
    }

    @Post("find")
    @UseGuards(systemConfigFactoryGuard(1,1))
    async find(@Body() selectBuyDto: SelectBuyDto, @ReqState() state: IState) {
        const data = await this.buyService.find(selectBuyDto, state);
        return {
            code: 200,
            msg: "查询成功",
            data
        };
    }

    @Post("unselect")
    async findDeleted(@Body() selectBuyDto: SelectBuyDto, @ReqState() state: IState) {
        const data = await this.buyService.findDeleted(selectBuyDto, state);
        return {
            code: 200,
            msg: "查询成功",
            data
        };
    }

    @Post("create")
    async create(@Body() addDto: AddBuyDto, @ReqState() state: IState) {
        await this.buyService.create(addDto, state.user.username);
        return {
            code: 200,
            msg: "保存成功"
        };
    }

    @Post("update")
    async update(@Body() updateDto: UpdateBuyDto, @ReqState() state: IState) {
        await this.buyService.update(updateDto, state.user.username);
        return {
            code: 200,
            msg: "更新成功"
        };
    }

    @Post("delete")
    async delete(@Body() deleteDto: DeleteBuyDto, @ReqState() state: IState) {
        await this.buyService.delete_data(deleteDto.buyid, state.user.username);
        return {
            code: 200,
            msg: "删除成功"
        };
    }

    @Post("undelete")
    async undelete(@Body() deleteDto: DeleteBuyDto, @ReqState() state: IState) {
        await this.buyService.undelete(deleteDto.buyid);
        return {
            code: 200,
            msg: "取消删除成功"
        };
    }

    @Post("level1Review")
    async level1Review(@Body() l1reviewDto: L1reviewBuyDto, @ReqState() state: IState) {
        await this.buyService.level1Review(l1reviewDto.buyid, state.user.username);
        return {
            code: 200,
            msg: '审核成功'
        };
    }

    @Post("unLevel1Review")
    async unLevel1Review(@Body() l1reviewDto: L1reviewBuyDto) {
        await this.buyService.unLevel1Review(l1reviewDto.buyid);
        return {
            code: 200,
            msg: '撤审成功'
        };
    }

  @Post("level2Review")
  async level2Review(@Body() l2reviewDto: L2reviewDto, @ReqState() state: IState) {
    await this.buyService.level2Review(l2reviewDto.buyid, state.user.username);
    return {
      code: 200,
      msg: '财务审核成功'
    };
  }

    @Post("unLevel2Review")
    async unLevel2Review(@Body() l2reviewDto: L2reviewDto) {
        await this.buyService.unLevel2Review(l2reviewDto.buyid);
        return {
            code: 200,
            msg: '财务撤审成功'
        };
    }
}
