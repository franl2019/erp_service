import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountInCome, IAccountInComeFind} from "./accountInCome";
import {AccountInComeFindDto} from "./dto/accountInComeFind.dto";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class AccountInComeEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findById(accountInComeId: number): Promise<IAccountInCome> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        account_income.accountInComeId,
                        account_income.accountInComeCode,
                        account_income.accountInComeType,
                        account_income.clientid,
                        account_income.indate,
                        account_income.amount,
                        account_income.reMark,
                        account_income.creater,
                        account_income.createdAt,
                        account_income.updater,
                        account_income.updatedAt,
                        account_income.level1Review,
                        account_income.level1Name,
                        account_income.level1Date,
                        account_income.level2Review,
                        account_income.level2Name,
                        account_income.level2Date,
                        account_income.del_uuid,
                        account_income.deleter,
                        account_income.deletedAt
                    FROM
                        account_income
                    WHERE 
                        account_income.del_uuid = 0
                        AND account_income.accountIncomeId = ?`
        const [res] = await conn.query(sql, [accountInComeId])
        if ((res as IAccountInCome[]).length > 0) {
            return (res as IAccountInCome[])[0]
        } else {
            return Promise.reject(new Error("查询出纳收入单失败"));
        }
    }

    public async find(findDto: AccountInComeFindDto): Promise<IAccountInComeFind[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                        account_income.accountInComeId,
                        account_income.accountInComeCode,
                        account_income.accountInComeType,
                        account_income.clientid,
                        account_income.indate,
                        account_income.amount,
                        account_income.reMark,
                        account_income.creater,
                        account_income.createdAt,
                        account_income.updater,
                        account_income.updatedAt,
                        account_income.level1Review,
                        account_income.level1Name,
                        account_income.level1Date,
                        account_income.level2Review,
                        account_income.level2Name,
                        account_income.level2Date,
                        account_income.del_uuid,
                        account_income.deleter,
                        account_income.deletedAt
                   FROM
                        account_income
                   WHERE 
                        account_income.del_uuid = 0`;
        const params = [];

        //按客户查询
        if (findDto.clientid) {
            sql = sql + ` AND account_income.clientid = ?`;
            params.push(findDto.clientid);
        }

        //按出纳收入单id查询
        if (findDto.accountInComeId) {
            sql = sql + ` AND account_income.accountInComeId = ?`;
            params.push(findDto.accountInComeId);
        }

        //按出纳收入单号查询
        if (findDto.accountInComeCode) {
            sql = sql + ` AND account_income.accountInComeCode = ?`;
            params.push(findDto.accountInComeCode);
        }

        //按出纳收入金额查询
        if (findDto.amount) {
            sql = sql + ` AND account_income.amount = ?`;
            params.push(findDto.amount);
        }

        //按付款账号查询
        if (findDto.paymentAccount) {
            sql = sql + ` AND account_income.paymentAccount = ?`;
            params.push(findDto.paymentAccount);
        }

        //按出仓日期范围查询
        if (findDto.startDate.length > 0 && findDto.endDate.length > 0) {
            sql = sql + ` AND DATE(account_income.indate) BETWEEN ? AND ?`;
            params.push(findDto.startDate, findDto.endDate);
        }

        //分页查询
        if (findDto.page >= 0 && findDto.pagesize >= 0) {
            sql = sql + ` LIMIT ?,?`;
            params.push(findDto.page, findDto.pagesize);
        }

        const [res] = await conn.query(sql, params);
        return (res as IAccountInComeFind[])
    }

    public async create(account_income: IAccountInCome) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO account_income (
                        account_income.accountInComeCode,
                        account_income.accountInComeType,
                        account_income.clientid,
                        account_income.indate,
                        account_income.amount,
                        account_income.reMark,
                        account_income.creater,
                        account_income.createdAt
                         ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            account_income.accountInComeCode,
            account_income.accountInComeType,
            account_income.clientid,
            account_income.indate,
            account_income.amount,
            account_income.reMark,
            account_income.creater,
            account_income.createdAt
        ]]]);
        if (res.affectedRows > 0 && res.insertId !== 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增出纳收入单失败"))
        }
    }

    public async update(account_income: IAccountInCome) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        account_income
                     SET
                        account_income.accountInComeType = ?,
                        account_income.clientid = ?,
                        account_income.indate = ?,
                        account_income.amount = ?,
                        account_income.reMark = ?,
                        account_income.updater = ?,
                        account_income.updatedAt = ?
                     WHERE
                         account_income.accountInComeId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            account_income.accountInComeType,
            account_income.clientid,
            account_income.indate,
            account_income.amount,
            account_income.reMark,
            account_income.updater,
            account_income.updatedAt,
            account_income.accountInComeId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新出纳收入单失败"));
        }
    }

    public async delete_data(accountInComeId: number, userName: string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        account_income
                     SET
                        account_income.del_uuid = ?,
                        account_income.deleter = ?,
                        account_income.deletedAt = ?
                     WHERE
                        account_income.accountInComeId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountInComeId,
            userName,
            new Date(),
            accountInComeId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("删除出纳收入单失败"));
        }
    }

    public async level1Review(accountInComeId: number, userName: string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        account_income
                     SET
                        account_income.level1Review = 1,
                        account_income.level1Name = ?,
                        account_income.level1Date = ?
                     WHERE
                         account_income.level1Review = 0
                         AND account_income.accountInComeId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            userName,
            new Date(),
            accountInComeId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("审核出纳收入单失败"));
        }
    }

    public async unLevel1Review(accountInComeId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        account_income
                     SET
                        account_income.level1Review = 0,
                        account_income.level1Name = '',
                        account_income.level1Date = ''
                     WHERE
                        account_income.level1Review = 1
                        AND account_income.accountInComeId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountInComeId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("撤审出纳收入单失败"));
        }
    }
}