import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountRecord} from "./accountRecord";
import {IAccountRecordFindDto} from "./dto/accountRecordFind.dto";
import {ResultSetHeader} from "mysql2/promise";
import {Injectable} from "@nestjs/common";
import {CodeType} from "../autoCode/codeType";

@Injectable()
export class AccountRecordEntity {

    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async findById(accountRecordId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                    	account_record.accountRecordId,
                        account_record.accountId,
                        account_record.indate,
                        account_record.openQty,
                        account_record.debitQty,
                        account_record.creditQty,
                        account_record.balanceQty,
                        account_record.reMark,
                        account_record.relatedNumber,
                        account_record.creater,
                        account_record.createdAt,
                        account_record.correlationId,
                        account_record.correlationType
                     FROM
                    	account_record
                     WHERE
                        account_record.accountRecordId = ?`;
        const [res] = await conn.query(sql, [accountRecordId]);
        if ((res as IAccountRecord[]).length > 0) {
            return (res as IAccountRecord[])[0];
        } else {
            return Promise.reject(new Error("查询出纳收支单失败"));
        }
    }

    public async find(findDto: IAccountRecordFindDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                    	account_record.accountRecordId,
                        account_record.accountId,
                        account_record.indate,
                        account_record.openQty,
                        account_record.debitQty,
                        account_record.creditQty,
                        account_record.balanceQty,
                        account_record.reMark,
                        account_record.relatedNumber,
                        account_record.creater,
                        account_record.createdAt,
                        account_record.correlationId,
                        account_record.correlationType
                   FROM
                    	account_record
                   WHERE
                        account_record.accountRecordId = ?`;
        const params = [];

        if (findDto.accountIds.length > 0) {
            sql = sql + ` AND account_record.accountId IN (?)`;
            params.push(findDto.accountIds);
        }

        if (findDto.accountRecordId) {
            sql = sql + ` AND account_record.accountRecordId = ?`;
            params.push(findDto.accountRecordId);
        }

        if (findDto.debitQty) {
            sql = sql + ` AND account_record.debitQty = ?`;
            params.push(findDto.debitQty);
        }

        if (findDto.creditQty) {
            sql = sql + ` AND account_record.creditQty = ?`;
            params.push(findDto.creditQty);
        }

        if (findDto.reMark) {
            sql = sql + ` AND account_record.reMark = ?`;
            params.push(findDto.reMark);
        }

        if (findDto.relatedNumber) {
            sql = sql + ` AND account_record.relatedNumber = ?`;
            params.push(findDto.relatedNumber);
        }

        //按出仓日期范围查询
        if (findDto.startDate.length > 0 && findDto.endDate.length > 0) {
            sql = sql + ` AND DATE(account_record.indate) BETWEEN ? AND ?`;
            params.push(findDto.startDate, findDto.endDate);
        }

        //分页查询
        if (findDto.page > 0 && findDto.pagesize > 0) {
            sql = sql + ` LIMIT ?,?`;
            params.push(findDto.page, findDto.pagesize);
        }

        const [res] = await conn.query(sql, params);
        return res as IAccountRecord[];
    }

    public async create(accountRecord: IAccountRecord) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO account_record (
                    	account_record.accountRecordId,
                        account_record.accountId,
                        account_record.indate,
                        account_record.openQty,
                        account_record.debitQty,
                        account_record.creditQty,
                        account_record.balanceQty,
                        account_record.reMark,
                        account_record.relatedNumber,
                        account_record.creater,
                        account_record.createdAt,
                        account_record.correlationId,
                        account_record.correlationType
                    	) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            accountRecord.accountRecordId,
            accountRecord.accountId,
            accountRecord.indate,
            accountRecord.openQty,
            accountRecord.debitQty,
            accountRecord.creditQty,
            accountRecord.balanceQty,
            accountRecord.reMark,
            accountRecord.relatedNumber,
            accountRecord.creater,
            accountRecord.createdAt,
            accountRecord.correlationId,
            accountRecord.correlationType
        ]]]);
        if (res.affectedRows > 0 && res.insertId !== 0) {
            return res;
        } else {
            return Promise.reject(new Error("创建出纳收支单错误"));
        }
    }

    public async deleteByAccountId(accountId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM account_record WHERE account_record.accountId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [accountId]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("删除出纳收支单出纳账户记录错误"));
        }
    }

    public async deleteByCorrelation(correlationId: number, type: CodeType.accountInCome | CodeType.accountExpenditure) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM account_record WHERE account_record.correlationId = ? AND account_record.correlationType = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [correlationId, type]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("删除出纳收支单出纳账户记录错误"));
        }
    }

    public async countAccountQty(accountId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `call account_record_qty_update(?)`;
        const [res] = await conn.query(sql, [accountId]);
        if ((res as IAccountRecord []).length > 0) {
            return res as IAccountRecord [];
        } else {
            return [];
        }
    }
}