import {Body, Controller, Post} from "@nestjs/common";
import {SaleGrossMarginMxReportService} from "./saleGrossMarginMxReport.service";
import {SaleGrossMarginMxReportFindDto} from "./dto/saleGrossMarginMxReportFind.dto";
import {ReqState} from "../../../decorator/user.decorator";
import {IState} from "../../../interface/IState";

@Controller('erp/report')
export class SaleGrossMarginMxReportController {

    constructor(
        private readonly saleGrossMarginMxReportService:SaleGrossMarginMxReportService
    ) {
    }

    @Post('saleGrossMarginMx')
    public async find(@Body() findDto:SaleGrossMarginMxReportFindDto, @ReqState() state: IState){
        if (findDto.warehouseids.length === 0) findDto.warehouseids = state.user.warehouseids;
        if (findDto.operateareaids.length === 0) findDto.operateareaids = state.user.client_operateareaids;
        const data = await this.saleGrossMarginMxReportService.find(findDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}