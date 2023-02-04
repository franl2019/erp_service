import {WeightedAverageRecordMxEntity} from "./weightedAverageRecordMx.entity";
import {IWeightedAverageRecordMx} from "./weightedAverageRecordMx";
import {Injectable} from "@nestjs/common";
import {WeightedAverageRecordService} from "../weightedAverageRecord/weightedAverageRecord.service";
import * as moment from "moment";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable()
export class WeightedAverageRecordMxService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly weightedAverageRecordMxEntity: WeightedAverageRecordMxEntity,
        private readonly weightedAverageRecordService: WeightedAverageRecordService,
    ) {
    }

    private async create(weightedAverageRecordMxList: IWeightedAverageRecordMx[]) {
        return await this.weightedAverageRecordMxEntity.create(weightedAverageRecordMxList);
    }

    private async delete_data(weightedAverageRecordId: number) {
        return await this.weightedAverageRecordMxEntity.delete_data(weightedAverageRecordId);
    }

    //计算 本月加权平均记录 Mx
    private async getWeightedAverageRecordMxThisMonth(date: Date) {

        const startDate = moment(date).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(date).endOf('month').format('YYYY-MM-DD');
        const lastMonth = moment(date).subtract(1, 'months').format('YYYY-MM')

        //检查是否已经初始化
        await this.weightedAverageRecordService.isAfterInitDate(startDate);
        return await this.weightedAverageRecordMxEntity.getWeightedAverageRecordMxThisMonth(lastMonth, startDate, endDate)
    }

    public async countWeightedAverageRecordMx(inDate: string, username: string) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            //查询本期
            const weightedAverageRecord = await this.weightedAverageRecordService.findByInDate(inDate);
            //已结转核算成本
            if (weightedAverageRecord.level1Review === 1) {
                return true
            }
            //未结转
            else if (weightedAverageRecord.level1Review === 0) {
                //查询上期月份
                const lastMonth = moment(inDate).subtract(1, 'month').format('YYYY-MM');
                //查询上期是否结算
                const countSuccess = await this.countWeightedAverageRecordMx(lastMonth, username);
                //上期结算完毕结算本期
                if (countSuccess) {
                    //计算本期
                    const weightedAverageRecordMxList = await this.getWeightedAverageRecordMxThisMonth(new Date(inDate));
                    //清空本期
                    await this.delete_data(weightedAverageRecord.weightedAverageRecordId);
                    //写入本期
                    await this.create(weightedAverageRecordMxList);

                    //更新版本号
                    await this.weightedAverageRecordService.updateVersionFinish(inDate, weightedAverageRecord.version_latest);

                    return true
                }
            }
        })
    }
}