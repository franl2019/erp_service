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
    public async findByInit() {
        return await this.weightedAverageRecordEntity.findByInit();
    }

    public async isAfterInitDate(date:string){
        const initWeightedAverageRecord = await this.findByInit();
        //不能查询超过初始化日期
        if (moment(initWeightedAverageRecord.inDate).isAfter(date)) {
            return Promise.reject(new Error('查询日期不能超过初始化日期'));
        }
    }

    public async findByInDate(inDate: string): Promise<IWeightedAverageRecord> {
        inDate = moment(inDate).format('YYYY-MM');
        const weightedAverageRecord = await this.weightedAverageRecordEntity.findByInDate(inDate);
        if (weightedAverageRecord) {
            return weightedAverageRecord
        }else {
            await this.isAfterInitDate(inDate);
            const weightedAverageRecord: IWeightedAverageRecord = {
                weightedAverageRecordId: 0,
                inDate: new Date(inDate),
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

    public async checkIfCountIsRequired() {
        //检查是否已经初始化
        await this.findByInit();
        return await this.weightedAverageRecordEntity.findByVersionLatest();
    }

    public async checkIsL1Review(inDate:string) {
       const weightedAverageRecord = await this.findByInDate(inDate);
       return weightedAverageRecord.level1Review === 1;
    }

    private async create(weightedAverageRecord: IWeightedAverageRecord) {
        return await this.weightedAverageRecordEntity.create(weightedAverageRecord);
    }

    public async createForInit(inDate: string, username: string) {
        const weightedAverageRecord: IWeightedAverageRecord = {
            weightedAverageRecordId: 0,
            inDate: moment(inDate).toDate(),
            level1Date: new Date(),
            level1Name: username,
            level1Review: 1,
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

    public async addVersionLatest(inDate: string) {
        const weightedAverageRecord = await this.findByInDate(inDate);
        await this.weightedAverageRecordEntity.addVersionLatest(inDate, weightedAverageRecord.version_latest + 1);
    }

    public async updateVersionFinish(inDate: string, version: number){
        inDate = moment(inDate).format('YYYY-MM');
        return await this.weightedAverageRecordEntity.updateVersionFinish(inDate,version);
    }

    public async l1Review(inDate: string, username: string) {
        const weightedAverageRecord = await this.findByInDate(inDate);
        if(weightedAverageRecord.level1Review === 1){
            return Promise.reject(new Error('成本已结转请勿重复'));
        }

        const lastMonth = moment(inDate).subtract(1, 'month').format('YYYY-MM');
        const weightedAverageRecordLastMonth = await this.findByInDate(lastMonth);
        if (weightedAverageRecordLastMonth.level1Review !== 1) {
            return Promise.reject(new Error('结转成本失败,请先结转上期成本'));
        }

        return await this.weightedAverageRecordEntity.l1Review(weightedAverageRecord.weightedAverageRecordId, username);
    }

    public async unl1Review(inDate: string) {
        const weightedAverageRecord = await this.findByInDate(inDate);
        if (weightedAverageRecord.level1Review !== 1) {
            return Promise.reject(new Error('本月未结转'))
        }

        const nextMonth = moment(inDate).add(1, 'month').format('YYYY-MM');
        const weightedAverageRecordNextMonth = await this.findByInDate(nextMonth);
        if (weightedAverageRecordNextMonth.level1Review === 1) {
            return Promise.reject(new Error('撤销结转成本失败,请先撤销下一期'));
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