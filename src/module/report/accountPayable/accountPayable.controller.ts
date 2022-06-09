import {Body, Controller, Post} from "@nestjs/common";
import {AccountPayableMxReport} from "./accountPayableMxReport/accountPayableMx.report";
import {AccountPayableMxReportFindDto} from "./accountPayableMxReport/dto/accountPayableMxReportFind.dto";
import {AccountPayableSumReport} from "./accountPayableSumReport/accountPayableSum.report";
import {AccountPayableSumReportFindDto} from "./accountPayableSumReport/dto/accountPayableSumReportFind.dto";

@Controller('erp/report')
export class AccountPayableController {

    constructor(
        private readonly accountPayableMxReport:AccountPayableMxReport,
        private readonly accountPayableSumReport:AccountPayableSumReport
    ) {
    }

    @Post('accountPayableMxReport')
    public async accountPayableMxReportFind(@Body() findDto:AccountPayableMxReportFindDto){
        const data = await this.accountPayableMxReport.find(findDto);

        return {
            code:200,
            msg:'查询成功',
            data
        }
    }

    @Post('accountPayableSumReport')
    public async accountPayableSumReportFind(@Body()findDto:AccountPayableSumReportFindDto){
        const data = await this.accountPayableSumReport.find(findDto);

        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}