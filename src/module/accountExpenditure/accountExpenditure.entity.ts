import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountExpenditure} from "./accountExpenditure";
import {AccountExpenditureFindDto} from "./dto/accountExpenditureFind.dto";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class AccountExpenditureEntity {
    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async findById(
        accountExpenditureId: number
    ): Promise<IAccountExpenditure> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                    account_expenditure.accountExpenditureId,
                    account_expenditure.accountExpenditureCode,
                    account_expenditure.accountExpenditureType,
                    account_expenditure.indate,
                    account_expenditure.buyid,
                    account_expenditure.amount,
                    account_expenditure.reMark,
                    account_expenditure.creater,
                    account_expenditure.createdAt,
                    account_expenditure.updater,
                    account_expenditure.updatedAt,
                    account_expenditure.level1Review,
                    account_expenditure.level1Name,
                    account_expenditure.level1Date,
                    account_expenditure.level2Review,
                    account_expenditure.level2Name,
                    account_expenditure.level2Date,
                    account_expenditure.del_uuid,
                    account_expenditure.deleter,
                    account_expenditure.deletedAt
                FROM
                    account_expenditure
                WHERE
                    account_expenditure.del_uuid = 0
                    AND account_expenditure.accountExpenditureId = ?`;
        const [res] = await conn.query(sql, [accountExpenditureId]);
        if ((res as IAccountExpenditure[]).length > 0) {
            return (res as IAccountExpenditure[])[0];
        } else {
            return Promise.reject(new Error("查询出纳支出单失败"));
        }
    }

    public async find(
        findDto: AccountExpenditureFindDto
    ): Promise<IAccountExpenditure[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                    account_expenditure.accountExpenditureId,
                    account_expenditure.accountExpenditureCode,
                    account_expenditure.accountExpenditureType,
                    account_expenditure.indate,
                    account_expenditure.buyid,
                    account_expenditure.amount,
                    account_expenditure.reMark,
                    account_expenditure.creater,
                    account_expenditure.createdAt,
                    account_expenditure.updater,
                    account_expenditure.updatedAt,
                    account_expenditure.level1Review,
                    account_expenditure.level1Name,
                    account_expenditure.level1Date,
                    account_expenditure.level2Review,
                    account_expenditure.level2Name,
                    account_expenditure.level2Date,
                    account_expenditure.del_uuid,
                    account_expenditure.deleter,
                    account_expenditure.deletedAt,
                    buy.buyname
                FROM
                    account_expenditure
                    inner join buy ON account_expenditure.buyid = buy.buyid
                WHERE 
                    account_expenditure.del_uuid = 0`;
        const params = [];

        //按供应商查询
        if (findDto.buyid) {
            sql = sql + ` AND account_expenditure.buyid = ?`;
            params.push(findDto.buyid);
        }

        //按出纳支出单id查询
        if (findDto.accountExpenditureId) {
            sql = sql + ` AND account_expenditure.accountExpenditureId = ?`;
            params.push(findDto.accountExpenditureId);
        }

        //按出纳支出单号查询
        if (findDto.accountExpenditureCode) {
            sql = sql + ` AND account_expenditure.accountExpenditureCode LIKE ?`;
            params.push(`${findDto.accountExpenditureCode}%`);
        }

        //按出仓日期范围查询
        if (findDto.startDate.length > 0 && findDto.endDate.length > 0) {
            sql = sql + ` AND DATE(account_expenditure.indate) BETWEEN ? AND ?`;
            params.push(findDto.startDate, findDto.endDate);
        }

        //分页查询
        if (findDto.page > 0 && findDto.pagesize > 0) {
            sql = sql + ` LIMIT ?,?`;
            params.push(findDto.page, findDto.pagesize);
        }

        sql = sql + ` ORDER BY substring(account_expenditure.accountExpenditureCode,15) + 0 DESC`;


        const [res] = await conn.query(sql, params);
        return res as IAccountExpenditure[];
    }

    public async create(account_expenditure: IAccountExpenditure) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO account_expenditure (
                    account_expenditure.accountExpenditureCode,
                    account_expenditure.accountExpenditureType,
                    account_expenditure.indate,
                    account_expenditure.buyid,
                    account_expenditure.amount,
                    account_expenditure.reMark,
                    account_expenditure.creater,
                    account_expenditure.createdAt
                 ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            [
                [
                    account_expenditure.accountExpenditureCode,
                    account_expenditure.accountExpenditureType,
                    account_expenditure.indate,
                    account_expenditure.buyid,
                    account_expenditure.amount,
                    account_expenditure.reMark,
                    account_expenditure.creater,
                    account_expenditure.createdAt
                ]
            ]
        ]);
        if (res.affectedRows > 0 && res.insertId !== 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增出纳支出单失败"));
        }
    }

    public async update(account_expenditure: IAccountExpenditure) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        account_expenditure 
                     SET
                        account_expenditure.accountExpenditureType = ?,
                        account_expenditure.indate = ?,
                        account_expenditure.buyid = ?,
                        account_expenditure.amount = ?,
                        account_expenditure.reMark = ?,
                        account_expenditure.updater = ?,
                        account_expenditure.updatedAt = ?
                     WHERE 
                        account_expenditure.accountExpenditureId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            account_expenditure.accountExpenditureType,
            account_expenditure.indate,
            account_expenditure.buyid,
            account_expenditure.amount,
            account_expenditure.reMark,
            account_expenditure.updater,
            account_expenditure.updatedAt,
            account_expenditure.accountExpenditureId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新出纳支出单失败"));
        }
    }

    public async level1Review(accountExpenditureId: number, userName: string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        account_expenditure 
                     SET
                        account_expenditure.level1Review = 1,
                        account_expenditure.level1Name = ?,
                        account_expenditure.level1Date = ?
                     WHERE 
                        account_expenditure.accountExpenditureId = ?
                        AND account_expenditure.level1Review = 0`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            userName,
            new Date(),
            accountExpenditureId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("审核出纳支出单失败"));
        }
    }

    public async unLevel1Review(accountExpenditureId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        account_expenditure 
                     SET
                        account_expenditure.level1Review = 0,
                        account_expenditure.level1Name = '',
                        account_expenditure.level1date = null
                     WHERE 
                        account_expenditure.accountExpenditureId = ?
                        AND account_expenditure.level1Review = 1`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountExpenditureId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("撤审出纳支出单失败"));
        }
    }

    public async deleteById(accountExpenditureId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM
                        account_expenditure
                     WHERE 
                        account_expenditure.accountExpenditureId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountExpenditureId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("删除出纳支出单失败"));
        }
    }
}
