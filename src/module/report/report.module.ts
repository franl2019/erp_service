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
import {BuyInboundReportController} from "./buyInboundReport/buyInboundReport.controller";
import {BuyInboundMxReport} from "./buyInboundReport/buyInboundMx.report";
import {BuyInboundProductSummaryReport} from "./buyInboundReport/buyInboundProductSummary.report";

@Module({
    imports: [MysqldbModule],
    controllers: [ReportController,SaleOutboundReportController,BuyInboundReportController],
    providers: [
        CashBankDepositJournalReport,
        AccountReceivableMxReport,
        AccountPayableMxReport,
        //销售单
        SaleOutboundMxReport,
        SaleOutboundProductSummaryReport,
        SaleOutboundClientProductSummaryReport,
        //采购进仓单
        BuyInboundMxReport,
        BuyInboundProductSummaryReport
    ]
})
export class ReportModule {}