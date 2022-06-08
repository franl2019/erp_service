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
import {AccountsReceivableMxReport} from "./accountsReceivableReport/accountsReceivableMx.report";
import {AccountsReceivableReportController} from "./accountsReceivableReport/accountsReceivableReport.controller";
import {AccountsReceivableSumReport} from "./accountsReceivableReport/accountsReceivableSum.report";

@Module({
    imports: [MysqldbModule],
    controllers: [
        ReportController,
        SaleOutboundReportController,
        BuyInboundReportController,
        AccountsReceivableReportController,],
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
        BuyInboundProductSummaryReport,
        //应收账款报表
        AccountsReceivableMxReport,
        AccountsReceivableSumReport
    ]
})
export class ReportModule {}