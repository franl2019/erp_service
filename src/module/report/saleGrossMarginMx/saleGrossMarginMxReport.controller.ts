import {Body, Controller, Post} from "@nestjs/common";
import {SaleGrossMarginMxReportService} from "./saleGrossMarginMxReport.service";
import {SaleGrossMarginMxReportFindDto} from "./dto/saleGrossMarginMxReportFind.dto";

@Controller('erp/report')
export class SaleGrossMarginMxReportController {

    constructor(
        private readonly saleGrossMarginMxReportService:SaleGrossMarginMxReportService
    ) {
    }

    @Post('saleGrossMarginMx')
    public async find(@Body() saleGrossMarginMxReportFindDto:SaleGrossMarginMxReportFindDto){
        const data = await this.saleGrossMarginMxReportService.find(saleGrossMarginMxReportFindDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}