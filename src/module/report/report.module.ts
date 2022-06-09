import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {CashBankDepositJournalReport} from "./cashBankDepositJournal/cashBankDepositJournal.report";
import {ReportController} from "./report.controller";
import {SaleOutboundMxReport} from "./saleOutboundReport/saleOutboundMx.report";
import {SaleOutboundProductSummaryReport} from "./saleOutboundReport/saleOutboundProductSummary.report";
import {SaleOutboundClientProductSummaryReport} from "./saleOutboundReport/saleOutboundClientProductSummary.report";
import {SaleOutboundReportController} from "./saleOutboundReport/saleOutboundReport.controller";
import {BuyInboundReportController} from "./buyInboundReport/buyInboundReport.controller";
import {BuyInboundMxReport} from "./buyInboundReport/buyInboundMx.report";
import {BuyInboundProductSummaryReport} from "./buyInboundReport/buyInboundProductSummary.report";
import {AccountsReceivableMxReport} from "./accountReceivable/accountsReceivableMxReport/accountsReceivableMx.report";
import {AccountsReceivableReportController} from "./accountReceivable/accountsReceivableReport.controller";
import {AccountsReceivableSumReport} from "./accountReceivable/accountsReceivableSumReport/accountsReceivableSum.report";
import {AccountPayableMxReport} from "./accountPayable/accountPayableMxReport/accountPayableMx.report";
import {AccountPayableController} from "./accountPayable/accountPayable.controller";
import {AccountPayableSumReport} from "./accountPayable/accountPayableSumReport/accountPayableSum.report";

@Module({
    imports: [MysqldbModule],
    controllers: [
        ReportController,
        SaleOutboundReportController,
        BuyInboundReportController,
        AccountsReceivableReportController,
        AccountPayableController,
    ],
    providers: [
        CashBankDepositJournalReport,
        //销售单
        SaleOutboundMxReport,
        SaleOutboundProductSummaryReport,
        SaleOutboundClientProductSummaryReport,
        //采购进仓单
        BuyInboundMxReport,
        BuyInboundProductSummaryReport,
        //应收账款报表
        AccountsReceivableMxReport,
        AccountsReceivableSumReport,

        //应付账款报表
        AccountPayableMxReport,
        AccountPayableSumReport,
    ]
})
export class ReportModule {}