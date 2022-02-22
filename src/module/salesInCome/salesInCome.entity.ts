import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {ISalesInCome, ISalesInComeFind} from "./salesInCome";
import {SalesInComeFindDto} from "./dto/salesInComeFind.dto";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class SalesInComeEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findById(salesInComeId: number): Promise<ISalesInCome> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        sales_income.salesInComeId,
                        sales_income.salesInComeCode,
                        sales_income.clientid,
                        sales_income.indate,
                        sales_income.payableAmt,
                        sales_income.currencyid,
                        sales_income.paymentAccount,
                        sales_income.exchangeRate,
                        sales_income.accountId,
                        sales_income.revenueAmt,
                        sales_income.reMark,
                        sales_income.creater,
                        sales_income.createdAt,
                        sales_income.updater,
                        sales_income.updatedAt,
                        sales_income.level1Review,
                        sales_income.level1Name,
                        sales_income.level1Date,
                        sales_income.level2Review,
                        sales_income.level2Name,
                        sales_income.level2Date
                    FROM
                        sales_income
                    WHERE
                        sales_income.del_uuid = 0
                        AND sales_income.salesInComeId = ?`
        const [res] = await conn.query(sql, [salesInComeId])
        if ((res as ISalesInCome[]).length > 0) {
            return (res as ISalesInCome[])[0]
        } else {
            return Promise.reject(new Error("查询销售收入单失败"));
        }
    }

    public async find(findDto: SalesInComeFindDto): Promise<ISalesInComeFind[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                        sales_income.salesInComeId,
                        sales_income.salesInComeCode,
                        sales_income.clientid,
                        sales_income.indate,
                        sales_income.payableAmt,
                        sales_income.currencyid,
                        sales_income.paymentAccount,
                        sales_income.exchangeRate,
                        sales_income.accountId,
                        sales_income.revenueAmt,
                        sales_income.reMark,
                        sales_income.creater,
                        sales_income.createdAt,
                        sales_income.updater,
                        sales_income.updatedAt,
                        sales_income.level1Review,
                        sales_income.level1Name,
                        sales_income.level1Date,
                        sales_income.level2Review,
                        sales_income.level2Name,
                        sales_income.level2Date,
                        client.clientname,
                        account.accountName
                    FROM
                        sales_income
                         LEFT JOIN client ON client.clientid = sales_income.clientid
                        LEFT JOIN account ON account.accountId = sales_income.accountId
                    WHERE
                        sales_income.del_uuid = 0`;
        const params = [];

        //按出纳账户查询
        if (findDto.accountIds.length > 0) {
            sql = sql + ` AND sales_income.accountId IN (?)`;
            params.push(findDto.accountIds);
        } else {
            return Promise.reject(new Error("查询销售收入单，缺少出纳账户权限"));
        }

        //按客户查询
        if (findDto.clientid) {
            sql = sql + ` AND sales_income.clientid = ?`;
            params.push(findDto.clientid);
        }

        //按销售收入单id查询
        if (findDto.salesInComeId) {
            sql = sql + ` AND sales_income.salesInComeId = ?`;
            params.push(findDto.salesInComeId);
        }

        //按销售收入单号查询
        if (findDto.salesInComeCode) {
            sql = sql + ` AND sales_income.salesInComeCode = ?`;
            params.push(findDto.salesInComeCode)
        }

        //按应收账款金额查询
        if (findDto.payableAmt) {
            sql = sql + ` AND sales_income.payableAmt = ?`;
            params.push(findDto.payableAmt)
        }

        //按出纳收入金额查询
        if (findDto.revenueAmt) {
            sql = sql + ` AND sales_income.revenueAmt = ?`;
            params.push(findDto.revenueAmt)
        }

        //按付款账号查询
        if (findDto.paymentAccount) {
            sql = sql + ` AND sales_income.paymentAccount = ?`;
            params.push(findDto.paymentAccount)
        }

        //按出仓日期范围查询
        if (findDto.startDate.length > 0 && findDto.endDate.length > 0) {
            sql = sql + ` AND DATE(sales_income.indate) BETWEEN ? AND ?`;
            params.push(findDto.startDate, findDto.endDate);
        }

        //分页查询
        if (findDto.page >= 0 && findDto.pagesize >= 0) {
            sql = sql + ` LIMIT ?,?`;
            params.push(findDto.page, findDto.pagesize);
        }

        const [res] = await conn.query(sql, params);
        return (res as ISalesInComeFind[]);
    }

    public async create(salesInCome: ISalesInCome) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO account_income (
                        sales_income.salesInComeId,
                        sales_income.salesInComeCode,
                        sales_income.clientid,
                        sales_income.indate,
                        sales_income.payableAmt,
                        sales_income.currencyid,
                        sales_income.paymentAccount,
                        sales_income.exchangeRate,
                        sales_income.accountId,
                        sales_income.revenueAmt,
                        sales_income.reMark,
                        sales_income.creater,
                        sales_income.createdAt
                     ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            salesInCome.salesInComeId,
            salesInCome.salesInComeCode,
            salesInCome.clientid,
            salesInCome.indate,
            salesInCome.payableAmt,
            salesInCome.currencyid,
            salesInCome.paymentAccount,
            salesInCome.exchangeRate,
            salesInCome.accountId,
            salesInCome.revenueAmt,
            salesInCome.reMark,
            salesInCome.creater,
            salesInCome.createdAt
        ]]]);
        if (res.affectedRows > 0 && res.insertId !== 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增销售收入单失败"));
        }
    }

    public async update(salesInCome: ISalesInCome) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        sales_income
                     SET
                        sales_income.salesInComeCode = ?,
                        sales_income.clientid = ?,
                        sales_income.indate = ?,
                        sales_income.payableAmt = ?,
                        sales_income.currencyid = ?,
                        sales_income.paymentAccount = ?,
                        sales_income.exchangeRate = ?,
                        sales_income.accountId = ?,
                        sales_income.revenueAmt = ?,
                        sales_income.reMark = ?,
                        sales_income.updater = ?,
                        sales_income.updatedAt = ?
                     WHERE
                        sales_income.salesInComeId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            salesInCome.salesInComeCode,
            salesInCome.clientid,
            salesInCome.indate,
            salesInCome.payableAmt,
            salesInCome.currencyid,
            salesInCome.paymentAccount,
            salesInCome.exchangeRate,
            salesInCome.accountId,
            salesInCome.revenueAmt,
            salesInCome.reMark,
            salesInCome.updater,
            salesInCome.updatedAt,
            salesInCome.salesInComeId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新销售收入单失败"));
        }
    }

    public async delete_data(salesInComeId: number, userName: string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        sales_income
                     SET
                        sales_income.del_uuid = ?,
                        sales_income.deleter = ?,
                        sales_income.deletedAt = ?
                     WHERE
                        sales_income.salesInComeId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            salesInComeId,
            userName,
            new Date(),
            salesInComeId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("删除销售收入单失败"));
        }
    }
}