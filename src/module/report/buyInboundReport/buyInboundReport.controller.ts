import {Controller, Post} from "@nestjs/common";
import {BuyInboundMxReport} from "./buyInboundMx.report";
import {BuyInboundProductSummaryReport} from "./buyInboundProductSummary.report";

@Controller('erp/report')
export class BuyInboundReportController {

    constructor(
        private readonly buyInboundMxReport:BuyInboundMxReport,
        private readonly buyInboundSummaryReport:BuyInboundProductSummaryReport
    ) {
    }

    @Post('buyInboundMxReport')
    public async buyInboundMxReportFind(){
        const data = await this.buyInboundMxReport.find();
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }

    @Post('buyInboundSummaryReport')
    public async buyInboundSummaryReportFind(){
        const data = await this.buyInboundSummaryReport.find();
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}