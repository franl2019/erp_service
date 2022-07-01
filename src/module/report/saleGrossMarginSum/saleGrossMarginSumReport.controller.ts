import {Body, Controller, Post} from "@nestjs/common";
import {SaleGrossMarginSumReportService} from "./saleGrossMarginSumReport.service";
import {SaleGrossMarginSumFindDto} from "./dto/saleGrossMarginSumFind.dto";
import {ReqState} from "../../../decorator/user.decorator";
import {IState} from "../../../interface/IState";

@Controller('erp/report')
export class SaleGrossMarginSumReportController {

    constructor(
        private readonly saleGrossMarginSumReportService:SaleGrossMarginSumReportService
    ) {
    }

    @Post('saleGrossMarginSum')
    public async find(@Body()findDto:SaleGrossMarginSumFindDto, @ReqState() state: IState){
        if (findDto.warehouseids.length === 0) findDto.warehouseids = state.user.warehouseids;
        if (findDto.operateareaids.length === 0) findDto.operateareaids = state.user.client_operateareaids;
        const data = await this.saleGrossMarginSumReportService.find(findDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}