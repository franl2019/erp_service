import {Body, Controller, Post} from "@nestjs/common";
import {BuyInboundMxReport} from "./buyInboundMx.report";
import {BuyInboundProductSummaryReport} from "./buyInboundProductSummary.report";
import {BuyInboundMxReportFindDto} from "./dto/buyInboundMxReportFind.dto";
import {ReqState} from "../../../decorator/user.decorator";
import {IState} from "../../../interface/IState";
import {BuyInboundProductSummaryReportFindDto} from "./dto/buyInboundProductSummaryReportFind.dto";

@Controller('erp/report')
export class BuyInboundReportController {

    constructor(
        private readonly buyInboundMxReport:BuyInboundMxReport,
        private readonly buyInboundSummaryReport:BuyInboundProductSummaryReport
    ) {
    }

    @Post('buyInboundMxReport')
    public async buyInboundMxReportFind(@Body() findDto:BuyInboundMxReportFindDto,@ReqState() state:IState){
        if (findDto.warehouseids.length === 0) findDto.warehouseids = state.user.warehouseids;
        if (findDto.operateareaids.length === 0) findDto.operateareaids = state.user.buy_operateareaids;
        const data = await this.buyInboundMxReport.find(findDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }

    @Post('buyInboundSummaryReport')
    public async buyInboundSummaryReportFind(@Body() findDto:BuyInboundProductSummaryReportFindDto,@ReqState() state:IState){
        if (findDto.warehouseids.length === 0) findDto.warehouseids = state.user.warehouseids;
        if (findDto.operateareaids.length === 0) findDto.operateareaids = state.user.buy_operateareaids;
        const data = await this.buyInboundSummaryReport.find(findDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}