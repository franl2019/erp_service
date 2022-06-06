import {Body, Controller, Post} from "@nestjs/common";
import {CashBankDepositJournalReport} from "./cashBankDepositJournal/cashBankDepositJournal.report";
import {cashBankDepositJournalReportFindDto} from "./cashBankDepositJournal/dto/cashBankDepositJournalReportFindDto";
import {AccountReceivableMxReport} from "./accountReceivableMxReport/accountReceivableMx.report";
import {AccountReceivableMxReportFindDto} from "./accountReceivableMxReport/dto/accountReceivableMxReportFind.dto";
import {AccountPayableMxReport} from "./accountPayableMxReport/accountPayableMx.report";
import {AccountPayableMxReportFindDto} from "./accountPayableMxReport/dto/AccountPayableMxReportFind.dto";
import {SaleOutboundMxReport} from "./saleOutboundReport/saleOutboundMx.report";
import {FindSaleOutboundDto} from "./saleOutboundReport/dto/findSaleOutbound.dto";
import {ReqState} from "../../decorator/user.decorator";
import {IState} from "../../interface/IState";
import {SaleOutboundProductSummaryReport} from "./saleOutboundReport/saleOutboundProductSummary.report";
import {SaleOutboundClientProductSummaryReport} from "./saleOutboundReport/saleOutboundClientProductSummary.report";

@Controller('erp/report')
export class ReportController {

    constructor(
        private readonly cashBankDepositJournalReport: CashBankDepositJournalReport,
        private readonly accountReceivableMxReport: AccountReceivableMxReport,
        private readonly accountPayableMxReport: AccountPayableMxReport,
        private readonly saleOutboundMxReport: SaleOutboundMxReport,
        private readonly saleOutboundProductSummaryReport:SaleOutboundProductSummaryReport,
        private readonly saleOutboundClientProductSummaryReport:SaleOutboundClientProductSummaryReport
    ) {
    }

    //销售明细表
    @Post('saleOutboundMxReport')
    public async saleOutboundMxReportFind(@Body() findDto:FindSaleOutboundDto,@ReqState() state:IState) {
        if(findDto.warehouseids.length === 0){
            findDto.warehouseids = state.user.warehouseids;
        }

        if(findDto.operateareaids.length === 0){
            findDto.operateareaids = state.user.client_operateareaids;
        }

        const data = await this.saleOutboundMxReport.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }


    //销售单产品汇总表
    @Post('saleOutboundProductSummaryReport')
    public async saleOutboundProductSummaryReportFind() {
        const data = await this.saleOutboundProductSummaryReport.find();
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    //销售单客户产品汇总表
    @Post('saleOutboundClientProductSummaryReport')
    public async saleOutboundClientProductSummaryReportFind() {
        const data = await this.saleOutboundClientProductSummaryReport.find();
        return {
            code: 200,
            msg: '查询成功',
            data
        }
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