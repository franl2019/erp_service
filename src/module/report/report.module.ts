import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {CashBankDepositJournalReport} from "./cashBankDepositJournal/cashBankDepositJournal.report";
import {ReportController} from "./report.controller";
import {AccountReceivableMxReport} from "./accountReceivableMxReport/accountReceivableMx.report";
import {AccountPayableMxReport} from "./accountPayableMxReport/accountPayableMx.report";
import {SaleOutboundMxReport} from "./saleOutboundReport/saleOutboundMx.report";
import {SaleOutboundProductSummaryReport} from "./saleOutboundReport/saleOutboundProductSummary.report";
import {SaleOutboundClientProductSummaryReport} from "./saleOutboundReport/saleOutboundClientProductSummary.report";
import {SaleOutboundReportController} from "./saleOutboundReport/saleOutboundReport.controller";

@Module({
    imports: [MysqldbModule],
    controllers: [ReportController,SaleOutboundReportController],
    providers: [
        CashBankDepositJournalReport,
        AccountReceivableMxReport,
        AccountPayableMxReport,
        SaleOutboundMxReport,
        SaleOutboundProductSummaryReport,
        SaleOutboundClientProductSummaryReport,
    ]
})
export class ReportModule {}