import {Injectable} from "@nestjs/common";
import {ResultSetHeader} from "mysql2/promise";
import {ICurrency} from "./ICurrency";
import {UpdateCurrencyDto} from "./dto/updateCurrency.dto";
import {DeleteCurrencyDto} from "./dto/deleteCurrency.dto";
import {AddCurrencyDto} from "./dto/addCurrency.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable()
export class CurrencyEntity {
    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async getCurrencys(): Promise<ICurrency[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT
                                  currency.currencyid,
                                  currency.currencyname,
                                  currency.standardmoneyflag,
                                  currency.creater,
                                  currency.createdAt,
                                  currency.updater,
                                  currency.updatedAt,
                                  currency.del_uuid,
                                  currency.deletedAt,
                                  currency.deleter
                             FROM
                                  currency
                             WHERE 
                                  del_uuid = 0`;
        const [res] = await conn.query(sql);
        return (res as ICurrency[]);
    }

    public async getDeletedCurrencys(): Promise<ICurrency[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                                  currency.currencyid,
                                  currency.currencyname,
                                  currency.standardmoneyflag,
                                  currency.creater,
                                  currency.createdAt,
                                  currency.updater,
                                  currency.updatedAt,
                                  currency.del_uuid,
                                  currency.deletedAt,
                                  currency.deleter
                             FROM currency WHERE del_uuid <> 0`;
        const [res] = await conn.query(sql);
        return (res as ICurrency[]);
    }

    public async getStandardMoney(): Promise<ICurrency> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                                  currency.currencyid,
                                  currency.currencyname,
                                  currency.standardmoneyflag,
                                  currency.creater,
                                  currency.createdAt,
                                  currency.updater,
                                  currency.updatedAt,
                                  currency.del_uuid,
                                  currency.deletedAt,
                                  currency.deleter
                              FROM 
                                  currency 
                              WHERE 
                                  del_uuid = 0 AND standardmoneyflag = 1`;
        const [res] = await conn.query(sql);
        return (res as ICurrency[])[0];
    }

    public async create(currency: AddCurrencyDto): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `INSERT INTO currency (
                                
                                  currency.currencyname,
                                  currency.standardmoneyflag,
                                  currency.creater,
                                  currency.createdAt
                              ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            currency.currencyname,
            currency.standardmoneyflag,
            currency.creater,
            currency.createdAt
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增币种失败"));
        }
    }

    public async update(currency: UpdateCurrencyDto): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                  currency 
                             SET 
                                  currency.currencyname = ?,
                                  currency.standardmoneyflag = ?,
                                  currency.updater = ?,
                                  currency.updatedAt = ?
                             WHERE del_uuid = 0 AND currencyid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            currency.currencyname,
            currency.standardmoneyflag,
            currency.updater,
            currency.updatedAt,
            currency.currencyid
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新币种失败"));
        }
    }

    public async delete_data(currency: DeleteCurrencyDto,userName:string): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                currency 
                             SET 
                                currency.del_uuid = currency.currencyid,
                                currency.deletedAt = ?,
                                currency.deleter = ?
                             WHERE del_uuid = 0 AND currencyid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            new Date(),
            userName,
            currency.currencyid
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("删除币种失败"));
        }
    }

    public async unDelete_data(currency: DeleteCurrencyDto): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                currency 
                             SET 
                                currency.del_uuid = 0,
                                currency.deletedAt = "",
                                currency.deleter = ""
                             WHERE del_uuid <> 0 AND currencyid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [currency.currencyid]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("取消删除币种失败"));
        }
    }

}