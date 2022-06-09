import {Body, Controller, Post} from "@nestjs/common";
import {AccountsReceivableMxReport} from "./accountsReceivableMxReport/accountsReceivableMx.report";
import {AccountsReceivableMxReportFindDto} from "./accountsReceivableMxReport/dto/accountsReceivableMxReportFind.dto";
import {AccountsReceivableSumReport} from "./accountsReceivableSumReport/accountsReceivableSum.report";
import {AccountsReceivableSumReportFindDto} from "./accountsReceivableSumReport/dto/accountsReceivableSumReportFind.dto";

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