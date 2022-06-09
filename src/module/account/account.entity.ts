import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccount} from "./account";
import {IFindAccountDto} from "./dto/findAccount.dto";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class AccountEntity {

    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async findOne(accountId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        account.accountId,
                        account.currencyid,
                        account.accountCode,
                        account.accountName,
                        account.accountType,
                        account.companyFlag,
                        account.creater,
                        account.createdAt,
                        account.updater,
                        account.updatedAt,
                        account.useFlag,
                        account.del_uuid,
                        account.deleter,
                        account.deletedAt
                     FROM
                        account
                     WHERE account.accountId = ?`
        const [res] = await conn.query(sql, [accountId]);
        if ((res as IAccount[]).length > 0) {
            return (res as IAccount[])[0];
        } else {
            return Promise.reject(new Error("查询单个出纳账户错误"));
        }
    }

    public async find(findDto: IFindAccountDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                        account.accountId,
                        account.currencyid,
                        account.accountCode,
                        account.accountName,
                        account.accountType,
                        account.companyFlag,
                        account.creater,
                        account.createdAt,
                        account.updater,
                        account.updatedAt,
                        account.useFlag,
                        currency.currencyname
                    FROM
                        account
                        INNER JOIN currency ON currency.currencyid = account.currencyid
                    WHERE
                        account.del_uuid = 0`;
        const params = [];
        if (findDto.accountId) {
            sql = sql + ` AND account.accountId = ?`;
            params.push(findDto.accountId);
        }

        if (findDto.accountName.length > 0) {
            sql = sql + ` AND account.accountName = ?`;
            params.push(findDto.accountName);
        }

        if (findDto.accountType.length > 0) {
            sql = sql + ` AND account.accountType = ?`;
            params.push(findDto.accountType);
        }

        if (findDto.companyFlag) {
            sql = sql + ` AND account.companyFlag = ?`;
            params.push(findDto.companyFlag);
        }

        if (findDto.useFlag) {
            sql = sql + ` AND account.useFlag = ?`;
            params.push(findDto.useFlag);
        }
        const [res] = await conn.query(sql, params);
        return res as IAccount[]
    }

    public async findAuthByUserId(userid:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        account.currencyid,
                        account.accountCode,
                        account.accountName,
                        account.accountType,
                        account.companyFlag,
                        account.creater,
                        account.createdAt,
                        account.updater,
                        account.updatedAt,
                        account.useFlag,
                        account.del_uuid,
                        account.deleter,
                        account.deletedAt,
                        account.accountId
                     FROM
                        account
                        INNER JOIN user_account_mx ON account.accountId = user_account_mx.accountId
                     WHERE
                     account.del_uuid = 0
                     AND user_account_mx.userid = ?`;
        const [res] = await conn.query(sql,[userid]);
        return res as IAccount[]
    }

    public async create(account: IAccount) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO account (
                        account.accountId, 
                        account.currencyid, 
                        account.accountCode, 
                        account.accountName, 
                        account.accountType, 
                        account.companyFlag, 
                        account.creater, 
                        account.createdAt,
                        account.useFlag
                    ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            account.accountId,
            account.currencyid,
            account.accountCode,
            account.accountName,
            account.accountType,
            account.companyFlag,
            account.creater,
            account.createdAt,
            account.useFlag
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("新建出纳账户失败"));
        }
    }

    public async update(account: IAccount) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        account 
                     SET
                        account.currencyid = ?,
                        account.accountCode = ?,
                        account.accountName = ?,
                        account.accountType = ?,
                        account.companyFlag = ?,
                        account.updater = ?,
                        account.updatedAt = ?,
                        account.useFlag = ?
                     WHERE 
                        account.accountId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            account.currencyid,
            account.accountCode,
            account.accountName,
            account.accountType,
            account.companyFlag,
            account.updater,
            account.updatedAt,
            account.useFlag,
            account.accountId
            ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("修改出纳账户失败"));
        }
    }

    public async delete_data(account: IAccount) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        account 
                     SET
                        account.del_uuid = ?,
                        account.deleter = ?,
                        account.deletedAt = ?
                     WHERE 
                        account.accountId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            account.del_uuid,
            account.deleter,
            account.deletedAt,
            account.accountId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("删除出纳账户失败"));
        }
    }

    public async unDelete_data(account: IAccount) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        account 
                     SET
                        account.del_uuid = 0,
                        account.deleter = "",
                        account.deletedAt = ""
                     WHERE 
                        account.accountId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            account.del_uuid,
            account.deleter,
            account.deletedAt
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("取消删除出纳账户失败"));
        }
    }
}