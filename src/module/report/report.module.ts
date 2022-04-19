import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {CashBankDepositJournalReport} from "./cashBankDepositJournal/cashBankDepositJournal.report";
import {ReportController} from "./report.controller";
import {AccountReceivableMxReport} from "./accountReceivableMxReport/accountReceivableMx.report";
import {AccountPayableMxReport} from "./accountPayableMxReport/accountPayableMx.report";

@Module({
    imports: [MysqldbModule],
    controllers: [ReportController],
    providers: [CashBankDepositJournalReport,AccountReceivableMxReport,AccountPayableMxReport]
})
export class ReportModule {}