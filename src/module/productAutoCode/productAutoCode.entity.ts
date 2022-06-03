import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IProductCode} from "./productAutoCode";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class ProductAutoCodeEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findOne(autoCodeName: string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT 
                        product_autocode.autoCodeName,
                        product_autocode.autoCodeNumber
                     FROM 
                        product_autocode
                     WHERE
                        product_autocode.autoCodeName = ?`;
        const [res] = await conn.query(sql, [autoCodeName])
        if ((res as IProductCode[]).length > 0) {
            return (res as IProductCode[])[0]
        } else {
            return null;
        }
    }

    public async create(productAutoCode: IProductCode) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO product_autocode (
                        product_autocode.autoCodeName,
                        product_autocode.autoCodeNumber
                        ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            productAutoCode.autoCodeName,
            productAutoCode.autoCodeNumber
        ]]])
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('新增产品自动编号失败'))
        }
    }

    public async update(productAutoCode: IProductCode){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        product_autocode
                     SET
                        product_autocode.autoCodeName = ?,
                        product_autocode.autoCodeNumber = ?
                     WHERE
                        product_autocode.autoCodeName = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            productAutoCode.autoCodeName,
            productAutoCode.autoCodeNumber,
            productAutoCode.autoCodeName
        ])
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('更新产品自动编号失败'))
        }
    }
}