import {Body, Controller, Post} from "@nestjs/common";
import {CashBankDepositJournalReport} from "./cashBankDepositJournal/cashBankDepositJournal.report";
import {cashBankDepositJournalReportFindDto} from "./cashBankDepositJournal/dto/cashBankDepositJournalReportFindDto";

@Controller('erp/report')
export class ReportController {

    constructor(
        private readonly cashBankDepositJournalReport: CashBankDepositJournalReport,
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
}