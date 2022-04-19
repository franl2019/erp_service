import {Body, Controller, Post} from "@nestjs/common";
import {CashBankDepositJournalReport} from "./cashBankDepositJournal/cashBankDepositJournal.report";
import {cashBankDepositJournalReportFindDto} from "./cashBankDepositJournal/dto/cashBankDepositJournalReportFindDto";
import {AccountReceivableMxReport} from "./accountReceivableMxReport/accountReceivableMx.report";
import {AccountReceivableMxReportFindDto} from "./accountReceivableMxReport/dto/accountReceivableMxReportFind.dto";
import {AccountPayableMxReport} from "./accountPayableMxReport/accountPayableMx.report";
import {AccountPayableMxReportFindDto} from "./accountPayableMxReport/dto/AccountPayableMxReportFind.dto";

@Controller('erp/report')
export class ReportController {

    constructor(
        private readonly cashBankDepositJournalReport: CashBankDepositJournalReport,
        private readonly accountReceivableMxReport: AccountReceivableMxReport,
        private readonly accountPayableMxReport: AccountPayableMxReport
    ) {
    }

    @Post('cashBankDepositJournalReport')
    public async cashBankDepositJournalReportFind(@Body() findDto: cashBankDepositJournalReportFindDto) {
        const data = await this.cashBankDepositJournalReport.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('accountReceivableMxReport')
    public async accountReceivableMxReportFind(@Body() findDto: AccountReceivableMxReportFindDto) {
        const data = await this.accountReceivableMxReport.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('accountPayableMxReport')
    public async accountPayableMxReportFind(@Body() findDto: AccountPayableMxReportFindDto) {
        const data = await this.accountPayableMxReport.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }
}