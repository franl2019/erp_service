import {Body, Controller, Post} from "@nestjs/common";
import {SaleOrderMxReport} from "./saleOrderMx.report";
import {SaleOrderMxFindReportDto} from "./saleOrderMxFindReport.dto";
import {IState, ReqState} from "../../../decorator/user.decorator";

@Controller('erp/report')
export class SaleOrderMxReportController {

    constructor(
        private readonly saleOrderMxReport: SaleOrderMxReport
    ) {
    }

    @Post('saleOrderMxReport')
    public async find(@Body() findDto: SaleOrderMxFindReportDto, @ReqState() state: IState) {
        findDto.warehouseids = state.user.warehouseids;
        const data = await this.saleOrderMxReport.find(findDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}