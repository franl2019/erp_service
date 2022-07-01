import {Body, Controller, Post} from "@nestjs/common";

import {SaleOutboundMxReport} from "./saleOutboundMx.report";
import {SaleOutboundProductSummaryReport} from "./saleOutboundProductSummary.report";
import {SaleOutboundClientProductSummaryReport} from "./saleOutboundClientProductSummary.report";
import {FindSaleOutboundDto} from "./dto/findSaleOutbound.dto";
import {ReqState} from "../../../decorator/user.decorator";
import {IState} from "../../../interface/IState";
import {SaleOutboundProductSummaryReportFindDto} from "./dto/saleOutboundProductSummaryReportFind.dto";
import {SaleOutboundClientProductSummaryReportFindDto} from "./dto/saleOutboundClientProductSummaryReportFind.dto";

@Controller('erp/report')
export class SaleOutboundReportController {

    constructor(
        private readonly saleOutboundMxReport: SaleOutboundMxReport,
        private readonly saleOutboundProductSummaryReport: SaleOutboundProductSummaryReport,
        private readonly saleOutboundClientProductSummaryReport: SaleOutboundClientProductSummaryReport
    ) {
    }

    //销售明细表
    @Post('saleOutboundMxReport')
    public async saleOutboundMxReportFind(@Body() findDto: FindSaleOutboundDto, @ReqState() state: IState) {
        if (findDto.warehouseids.length === 0) {
            findDto.warehouseids = state.user.warehouseids;
        }

        if (findDto.operateareaids.length === 0) {
            findDto.operateareaids = state.user.client_operateareaids;
        }

        const data = await this.saleOutboundMxReport.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }


    //销售单产品汇总表
    @Post('saleOutboundProductSummaryReport')
    public async saleOutboundProductSummaryReportFind(@Body() findDto: SaleOutboundProductSummaryReportFindDto, @ReqState() state: IState) {
        if (findDto.warehouseids.length === 0) findDto.warehouseids = state.user.warehouseids;
        if (findDto.operateareaids.length === 0) findDto.operateareaids = state.user.client_operateareaids;
        const data = await this.saleOutboundProductSummaryReport.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    //销售单客户产品汇总表
    @Post('saleOutboundClientProductSummaryReport')
    public async saleOutboundClientProductSummaryReportFind(@Body() findDto:SaleOutboundClientProductSummaryReportFindDto, @ReqState() state: IState) {
        if (findDto.warehouseids.length === 0) findDto.warehouseids = state.user.warehouseids;
        if (findDto.operateareaids.length === 0) findDto.operateareaids = state.user.client_operateareaids;
        const data = await this.saleOutboundClientProductSummaryReport.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }
}