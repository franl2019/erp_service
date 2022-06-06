import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {CashBankDepositJournalReport} from "./cashBankDepositJournal/cashBankDepositJournal.report";
import {ReportController} from "./report.controller";
import {AccountReceivableMxReport} from "./accountReceivableMxReport/accountReceivableMx.report";
import {AccountPayableMxReport} from "./accountPayableMxReport/accountPayableMx.report";
import {SaleOutboundMxReport} from "./saleOutboundReport/saleOutboundMx.report";
import {SaleOutboundProductSummaryReport} from "./saleOutboundReport/saleOutboundProductSummary.report";
import {SaleOutboundClientProductSummaryReport} from "./saleOutboundReport/saleOutboundClientProductSummary.report";

@Module({
    imports: [MysqldbModule],
    controllers: [ReportController],
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