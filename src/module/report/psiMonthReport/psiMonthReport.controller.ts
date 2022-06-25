import {Body, Controller, Post} from "@nestjs/common";
import {PsiMonthReport} from "./psiMonth.report";
import {PsiMonthReportFindDto} from "./dto/psiMonthReportFind.dto";

@Controller('erp/report')
export class PsiMonthReportController {

    constructor(
        private readonly psiMonthReportService:PsiMonthReport
    ) {
    }

    @Post('psiMonthReport')
    public async find(@Body() findDto:PsiMonthReportFindDto){
        const data = await this.psiMonthReportService.find(findDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}