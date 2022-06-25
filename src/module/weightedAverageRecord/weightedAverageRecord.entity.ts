import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IWeightedAverageRecord} from "./weightedAverageRecord";
import {ResultSetHeader} from "mysql2/promise";
import {Injectable} from "@nestjs/common";

@Injectable()
export class WeightedAverageRecordEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findByInit() {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        weighted_average_record.weightedAverageRecordId,
                        weighted_average_record.inDate,
                        weighted_average_record.level1Review,
                        weighted_average_record.level1Name,
                        weighted_average_record.level1Date,
                        weighted_average_record.level2Review,
                        weighted_average_record.level2Name,
                        weighted_average_record.level2Date,
                        weighted_average_record.initReview,
                        weighted_average_record.initName,
                        weighted_average_record.initDate,
                        weighted_average_record.version,
                        weighted_average_record.version_latest
                     FROM
                        weighted_average_record
                     WHERE
                        weighted_average_record.initReview = 1`;

        const [res] = await conn.query(sql);
        if ((res as IWeightedAverageRecord[]).length > 0) {
            return res[0] as IWeightedAverageRecord
        } else {
            return Promise.reject(new Error('查询月加权平均初始化记录失败'))
        }
    }

    public async findByVersionLatest() {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        weighted_average_record.weightedAverageRecordId,
                        weighted_average_record.inDate,
                        weighted_average_record.level1Review,
                        weighted_average_record.level1Name,
                        weighted_average_record.level1Date,
                        weighted_average_record.level2Review,
                        weighted_average_record.level2Name,
                        weighted_average_record.level2Date,
                        weighted_average_record.initReview,
                        weighted_average_record.initName,
                        weighted_average_record.initDate,
                        weighted_average_record.version,
                        weighted_average_record.version_latest
                     FROM
                        weighted_average_record
                     WHERE
                        weighted_average_record.level1Review = 0
                        AND weighted_average_record.version <> weighted_average_record.version_latest`;
        const [res] = await conn.query(sql);
        return (res as IWeightedAverageRecord[]).length > 0;
    }

    public async addVersionLatest(inDate: string, version_latest: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        weighted_average_record
                     SET
                        weighted_average_record.version_latest = ${conn.escape(version_latest)}
                     WHERE
                        weighted_average_record.inDate LIKE ${conn.escape(inDate+'%')}`;
        console.log(sql)
        const [res] = await conn.query<ResultSetHeader>(sql);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('更新月加权平均记录版本失败'))
        }
    }

    public async findByInDate(inDate: string): Promise<IWeightedAverageRecord> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        weighted_average_record.weightedAverageRecordId,
                        weighted_average_record.inDate,
                        weighted_average_record.level1Review,
                        weighted_average_record.level1Name,
                        weighted_average_record.level1Date,
                        weighted_average_record.level2Review,
                        weighted_average_record.level2Name,
                        weighted_average_record.level2Date,
                        weighted_average_record.initReview,
                        weighted_average_record.initName,
                        weighted_average_record.initDate,
                        weighted_average_record.version,
                        weighted_average_record.version_latest
                     FROM
                        weighted_average_record
                     WHERE
                        weighted_average_record.inDate LIKE ${conn.escape(inDate+'%')}`;
        const [res] = await conn.query(sql);
        if ((res as IWeightedAverageRecord[]).length > 0) {
            return res[0] as IWeightedAverageRecord
        } else {
            return null
        }
    }

    public async create(weightedAverageRecord: IWeightedAverageRecord) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO weighted_average_record (
                         weighted_average_record.inDate,
                         weighted_average_record.level1Review,
                         weighted_average_record.level1Name,
                         weighted_average_record.level1Date,
                         weighted_average_record.level2Review,
                         weighted_average_record.level2Name,
                         weighted_average_record.level2Date,
                         weighted_average_record.initReview,
                         weighted_average_record.initName,
                         weighted_average_record.initDate,
                         weighted_average_record.version,
                         weighted_average_record.version_latest
                     ) VALUE ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            weightedAverageRecord.inDate,
            weightedAverageRecord.level1Review,
            weightedAverageRecord.level1Name,
            weightedAverageRecord.level1Date,
            weightedAverageRecord.level2Review,
            weightedAverageRecord.level2Name,
            weightedAverageRecord.level2Date,
            weightedAverageRecord.initReview,
            weightedAverageRecord.initName,
            weightedAverageRecord.initDate,
            weightedAverageRecord.version,
            weightedAverageRecord.version_latest
        ]]])
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('创建月加权平均记录失败'))
        }
    }

    public async updateVersionFinish(inDate: string, version: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        weighted_average_record
                     SET
                        weighted_average_record.version = ${conn.escape(version)}
                     WHERE
                        weighted_average_record.inDate LIKE ${conn.escape(inDate+'%')}`;
        console.log(sql)
        const [res] = await conn.query<ResultSetHeader>(sql);
        if(res.affectedRows>0){
            return res;
        }else{
            return Promise.reject(new Error('更新版本号失败'))
        }
    }

    //锁定成本
    public async l1Review(weightedAverageRecordId: number, username: string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        weighted_average_record
                     SET
                        weighted_average_record.level1Review = 1,
                        weighted_average_record.level1Name = ?,
                        weighted_average_record.level1Date = ?
                     WHERE
                        weighted_average_record.weightedAverageRecordId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            username,
            new Date(),
            weightedAverageRecordId
        ]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('锁定成本审核失败'));
        }
    }

    public async unl1Review(weightedAverageRecordId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        weighted_average_record
                     SET
                        weighted_average_record.level1Review = 0,
                        weighted_average_record.level1Name = '',
                        weighted_average_record.level1Date = ''
                     WHERE
                        weighted_average_record.weightedAverageRecordId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            weightedAverageRecordId
        ]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('撤销锁定成本审核失败'));
        }
    }

    //月结审核
    public async l2Review(weightedAverageRecordId: number, username: string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        weighted_average_record
                     SET
                        weighted_average_record.level2Review = 1,
                        weighted_average_record.level2Name = ?,
                        weighted_average_record.level2Date = ?
                     WHERE
                        weighted_average_record.weightedAverageRecordId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            username,
            new Date(),
            weightedAverageRecordId
        ]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('月结审核失败'));
        }
    }

    public async unl2Review(weightedAverageRecordId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        weighted_average_record
                     SET
                        weighted_average_record.level2Review = 0,
                        weighted_average_record.level2Name = '',
                        weighted_average_record.level2Date = ''
                     WHERE
                        weighted_average_record.weightedAverageRecordId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            weightedAverageRecordId
        ]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('撤销月结审核失败'));
        }
    }
}