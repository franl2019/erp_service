import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IWeightedAverageRecordMx} from "./weightedAverageRecordMx";
import {ResultSetHeader} from "mysql2/promise";
import {Injectable} from "@nestjs/common";

@Injectable()
export class WeightedAverageRecordMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    // public async find(weightedAverageRecordId: number) {
    //     const conn = await this.mysqldbAls.getConnectionInAls();
    //     const sql = `SELECT
    //                     weighted_average_record_mx.weightedAverageRecordId,
    //                     weighted_average_record_mx.productid,
    //                     weighted_average_record_mx.spec_d,
    //                     weighted_average_record_mx.materials_d,
    //                     weighted_average_record_mx.remark,
    //                     weighted_average_record_mx.remarkmx,
    //                     weighted_average_record_mx.qty,
    //                     weighted_average_record_mx.price,
    //                     weighted_average_record_mx.amount
    //                  FROM
    //                     weighted_average_record_mx
    //                  WHERE
    //                     weighted_average_record_mx.weightedAverageRecordId = ?`;
    //     const [res] = await conn.query(sql, [weightedAverageRecordId]);
    //     return res as IWeightedAverageRecordMx[];
    // }

    public async create(weightedAverageRecordMxList: IWeightedAverageRecordMx[]) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO weighted_average_record_mx (
                        weighted_average_record_mx.weightedAverageRecordId,
                        weighted_average_record_mx.productid,
                        weighted_average_record_mx.spec_d,
                        weighted_average_record_mx.materials_d,
                        weighted_average_record_mx.remark,
                        weighted_average_record_mx.remarkmx,
                        weighted_average_record_mx.qty,
                        weighted_average_record_mx.price,
                        weighted_average_record_mx.amount
                    ) VALUES ?`
        const [res] = await conn.query<ResultSetHeader>(sql,[
                weightedAverageRecordMxList.map(weightedAverageRecordMx=>[
                weightedAverageRecordMx.weightedAverageRecordId,
                weightedAverageRecordMx.productid,
                weightedAverageRecordMx.spec_d,
                weightedAverageRecordMx.materials_d,
                weightedAverageRecordMx.remark,
                weightedAverageRecordMx.remarkmx,
                weightedAverageRecordMx.qty,
                weightedAverageRecordMx.price,
                weightedAverageRecordMx.amount
            ])
        ]);
        if(res.affectedRows>0){
            return res;
        }else{
            return Promise.reject(new Error('增加月加权记录明细失败'))
        }
    }

    public async delete_data(weightedAverageRecordId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM
                        weighted_average_record_mx
                     WHERE
                        weighted_average_record_mx.weightedAverageRecordId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[weightedAverageRecordId]);
        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('删除月加权记录明细失败'))
        }
    }
}