import {Body, Controller, Post} from "@nestjs/common";
import {SaleGrossMarginSumReportService} from "./saleGrossMarginSumReport.service";
import {SaleGrossMarginSumFindDto} from "./dto/saleGrossMarginSumFind.dto";

@Controller('erp/report')
export class SaleGrossMarginSumReportController {

    constructor(
        private readonly saleGrossMarginSumReportService:SaleGrossMarginSumReportService
    ) {
    }

    @Post('saleGrossMarginSum')
    public async find(@Body()findDto:SaleGrossMarginSumFindDto){
        const data = await this.saleGrossMarginSumReportService.find(findDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}