import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IBuyAutoCode} from "./buyAutoCode";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class BuyAutoCodeEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findOne(parentName: string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        buy_autocode.autoCodeName,
                        buy_autocode.autoCodeNumber
                     FROM
                        buy_autocode
                     WHERE
                        buy_autocode.autoCodeName = ?`;
        const [res] = await conn.query(sql, [parentName])
        if ((res as IBuyAutoCode[]).length > 0) {
            return (res as IBuyAutoCode[])[0]
        } else {
            return null
        }
    }

    public async create(buyAutoCode: IBuyAutoCode) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO buy_autocode (
                        buy_autocode.autoCodeName,
                        buy_autocode.autoCodeNumber
                    ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            buyAutoCode.autoCodeName,
            buyAutoCode.autoCodeNumber,
        ]]])

        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('新增供应商资料自动编号顺序记录失败'))
        }
    }

    public async update(buyAutoCode: IBuyAutoCode) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                         buy_autocode
                     SET
                        buy_autocode.autoCodeName = ?,
                        buy_autocode.autoCodeNumber = ?
                     WHERE
                        buy_autocode.autoCodeName = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            buyAutoCode.autoCodeName,
            buyAutoCode.autoCodeNumber,
            buyAutoCode.autoCodeName
        ])

        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('更新供应商资料自动编号顺序记录失败'))
        }
    }
}