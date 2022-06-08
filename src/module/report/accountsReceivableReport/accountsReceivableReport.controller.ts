import {Body, Controller, Post} from "@nestjs/common";
import {AccountsReceivableMxReport} from "./accountsReceivableMx.report";
import {AccountsReceivableMxReportFindDto} from "./dto/accountsReceivableMxReportFind.dto";
import {AccountsReceivableSumReport} from "./accountsReceivableSum.report";
import {AccountsReceivableSumReportFindDto} from "./dto/accountsReceivableSumReportFind.dto";

@Controller('erp/report')
export class AccountsReceivableReportController {

    constructor(
        private readonly accountsReceivableMxReport:AccountsReceivableMxReport,
        private readonly accountsReceivableSumReport:AccountsReceivableSumReport
    ) {
    }

    @Post('accountsReceivableMxReport')
    public async accountsReceivableMxReportFind(@Body() findDto:AccountsReceivableMxReportFindDto){
        const data = await this.accountsReceivableMxReport.find(findDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }

    @Post('accountsReceivableSumReport')
    public async accountsReceivableSumReportFind(@Body() findDto:AccountsReceivableSumReportFindDto){
        const data = await this.accountsReceivableSumReport.find(findDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}