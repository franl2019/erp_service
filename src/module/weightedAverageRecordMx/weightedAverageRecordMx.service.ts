import {WeightedAverageRecordMxEntity} from "./weightedAverageRecordMx.entity";
import {IWeightedAverageRecordMx} from "./weightedAverageRecordMx";
import {Injectable} from "@nestjs/common";
import {WeightedAverageRecordService} from "../weightedAverageRecord/weightedAverageRecord.service";
import * as moment from "moment";
import {PsiMonthReport} from "../report/psiMonthReport/psiMonth.report.";
import {IPsiMonthReport} from "../report/psiMonthReport/psiMonthReport";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable()
export class WeightedAverageRecordMxService {

    constructor(
        private readonly mysqldbAls:MysqldbAls,
        private readonly weightedAverageRecordMxEntity: WeightedAverageRecordMxEntity,
        private readonly weightedAverageRecordService: WeightedAverageRecordService,
        private readonly psiMonthReport: PsiMonthReport
    ) {
    }

    private async create(weightedAverageRecordMxList: IWeightedAverageRecordMx[]) {
        return await this.weightedAverageRecordMxEntity.create(weightedAverageRecordMxList);
    }

    private async delete_data(weightedAverageRecordId: number) {
        return await this.weightedAverageRecordMxEntity.delete_data(weightedAverageRecordId);
    }

    //为 进销存月报表 创建加权平均记录
    private async createWeightedAverageRecordMxForPsi(psiMonthReportList: IPsiMonthReport[], option: { weightedAverageRecordId: number }) {
        const weightedAverageRecordMxList: IWeightedAverageRecordMx[] = [];
        for (let i = 0; i < psiMonthReportList.length; i++) {
            const psiMonthReport = psiMonthReportList[i];
            const weightedAverageRecordMx: IWeightedAverageRecordMx = {
                weightedAverageRecordId: option.weightedAverageRecordId,
                productid: psiMonthReport.productid,
                spec_d: psiMonthReport.spec_d,
                materials_d: psiMonthReport.materials_d,
                remark: psiMonthReport.remark,
                remarkmx: psiMonthReport.remarkmx,
                qty: psiMonthReport.balanceQty_thisMonth,
                price: psiMonthReport.weightedAveragePrice_thisMonth,
                amount: psiMonthReport.balanceAmount_thisMonth,
            }
            weightedAverageRecordMxList.push(weightedAverageRecordMx)
        }
        return await this.create(weightedAverageRecordMxList);
    }

    public async countWeightedAverageRecordMx(inDate: string, username: string, isCountBalance: boolean) {
        return await this.mysqldbAls.sqlTransaction(async ()=>{
            const weightedAverageRecord = await this.weightedAverageRecordService.findByInDate(inDate, username);
            if (weightedAverageRecord.level1Review === 0) {
                //版本一致,计算上期记录,因为上期加权变了,本期就算没有变也要重新计算
                const lastMonth = moment(inDate).subtract(1, 'month').format('YYYY-MM');
                await this.countWeightedAverageRecordMx(lastMonth, username, true);

                if (isCountBalance) {
                    //计算本期
                    const startDate: string = moment(weightedAverageRecord.inDate).startOf('month').format('YYYY-MM-DD');
                    const endDate: string = moment(weightedAverageRecord.inDate).endOf('month').format('YYYY-MM-DD');
                    const psiMonthReportList = await this.psiMonthReport.find({startDate, endDate});
                    await this.delete_data(weightedAverageRecord.weightedAverageRecordId);
                    return await this.createWeightedAverageRecordMxForPsi(psiMonthReportList, {
                        weightedAverageRecordId: weightedAverageRecord.weightedAverageRecordId
                    });
                }
            }
        })
    }


}