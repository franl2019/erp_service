import {WeightedAverageRecordEntity} from "./weightedAverageRecord.entity";
import {IWeightedAverageRecord} from "./weightedAverageRecord";
import {Injectable} from "@nestjs/common";
import * as moment from "moment";

@Injectable()
export class WeightedAverageRecordService {

    constructor(
        private readonly weightedAverageRecordEntity: WeightedAverageRecordEntity
    ) {
    }

    //查询初始化记录
    public async findByInit(){
        return await this.weightedAverageRecordEntity.findByInit();
    }

    public async findByInDate(inDate: string): Promise<IWeightedAverageRecord> {
        inDate = moment(inDate).format('YYYY-MM');

        const initWeightedAverageRecord = await this.findByInit();
        //不能查询超过初始化日期
        if (moment(initWeightedAverageRecord.initDate).isAfter(inDate)) {
            return Promise.reject(new Error('查询日期不能超过初始化日期'));
        }

        const weightedAverageRecord = await this.weightedAverageRecordEntity.findByInDate(inDate);

        if (weightedAverageRecord) {
            return weightedAverageRecord
        } else {
            const weightedAverageRecord: IWeightedAverageRecord = {
                weightedAverageRecordId: 0,
                inDate: moment(inDate).toDate(),
                level1Date: null,
                level1Name: "",
                level1Review: 0,
                level2Date: null,
                level2Name: "",
                level2Review: 0,
                initDate: null,
                initName: '',
                initReview: 0,
                version: 0,
                version_latest: 0,
            }
            const resultCreate = await this.create(weightedAverageRecord);
            weightedAverageRecord.weightedAverageRecordId = resultCreate.insertId;
            return weightedAverageRecord;
        }
    }

    private async create(weightedAverageRecord: IWeightedAverageRecord) {
        return await this.weightedAverageRecordEntity.create(weightedAverageRecord);
    }

    public async createForInit(inDate: string, username: string){
        const weightedAverageRecord: IWeightedAverageRecord = {
            weightedAverageRecordId: 0,
            inDate: moment(inDate).toDate(),
            level1Date: null,
            level1Name: "",
            level1Review: 0,
            level2Date: null,
            level2Name: "",
            level2Review: 0,
            initDate: new Date(),
            initName: username,
            initReview: 1,
            version: 0,
            version_latest: 0,
        }
        const resultCreate = await this.create(weightedAverageRecord);
        weightedAverageRecord.weightedAverageRecordId = resultCreate.insertId;
        return weightedAverageRecord;
    }

    public async addVersionLatest(inDate: string){
        const weightedAverageRecord = await this.findByInDate(inDate);
        await this.weightedAverageRecordEntity.addVersionLatest(inDate,weightedAverageRecord.version_latest + 1);
    }

    public async l1Review(inDate: string, username: string) {
        const weightedAverageRecord = await this.findByInDate(inDate);
        const lastMonth = moment(inDate).subtract(1, 'month').format('YYYY-MM');
        const weightedAverageRecordLastMonth = await this.findByInDate(lastMonth);
        if (weightedAverageRecordLastMonth.level1Review !== 1) {
            return Promise.reject(new Error('结转成本审核失败,请先结转上期成本'));
        }
        return await this.weightedAverageRecordEntity.l1Review(weightedAverageRecord.weightedAverageRecordId, username);
    }

    public async unl1Review(inDate: string) {
        const weightedAverageRecord = await this.findByInDate(inDate);
        if(weightedAverageRecord.level1Review === 1){
            return Promise.reject(new Error('本月成本已结转审核,请勿重复'))
        }

        const nextMonth = moment(inDate).add(1, 'month').format('YYYY-MM');
        const weightedAverageRecordNextMonth = await this.findByInDate(nextMonth);
        if (weightedAverageRecordNextMonth.level1Review === 1) {
            return Promise.reject(new Error('撤审结转失败,请先撤审下一期'));
        }
        return await this.weightedAverageRecordEntity.unl1Review(weightedAverageRecord.weightedAverageRecordId);
    }

    public async l2Review(weightedAverageRecordId: number, username: string) {
        return await this.weightedAverageRecordEntity.l2Review(weightedAverageRecordId, username);
    }

    public async unl2Review(weightedAverageRecordId: number) {
        return await this.weightedAverageRecordEntity.unl2Review(weightedAverageRecordId);
    }
}