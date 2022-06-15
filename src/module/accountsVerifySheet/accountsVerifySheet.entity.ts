import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountsVerifySheet, IAccountsVerifySheetFind} from "./accountsVerifySheet";
import {AccountsVerifySheetFindDto} from "./dto/accountsVerifySheetFind.dto";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class AccountsVerifySheetEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findById(accountsVerifySheetId: number) {
        const conn = this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        accounts_verify_sheet.accountsVerifySheetId,
                        accounts_verify_sheet.accountsVerifySheetCode,
                        accounts_verify_sheet.sheetType,
                        accounts_verify_sheet.inDate,
                        accounts_verify_sheet.clientid,
                        accounts_verify_sheet.clientid_b,
                        accounts_verify_sheet.buyid,
                        accounts_verify_sheet.buyid_b,
                        accounts_verify_sheet.creater,
                        accounts_verify_sheet.createdAt,
                        accounts_verify_sheet.updater,
                        accounts_verify_sheet.updatedAt,
                        accounts_verify_sheet.level1Review,
                        accounts_verify_sheet.level1Name,
                        accounts_verify_sheet.level1Date,
                        accounts_verify_sheet.level2Review,
                        accounts_verify_sheet.level2Name,
                        accounts_verify_sheet.level2Date,
                        accounts_verify_sheet.del_uuid,
                        accounts_verify_sheet.deleter,
                        accounts_verify_sheet.deleteAt,
                        accounts_verify_sheet.reMark1,
                        accounts_verify_sheet.reMark2,
                        accounts_verify_sheet.reMark3
                     FROM
                        accounts_verify_sheet
                     WHERE
                        accounts_verify_sheet.del_uuid = 0
                        AND accounts_verify_sheet.accountsVerifySheetId = ?`;
        const [res] = await conn.query(sql, [accountsVerifySheetId]);
        if ((res as IAccountsVerifySheet[]).length > 0) {
            return (res as IAccountsVerifySheet[])[0]
        } else {
            return Promise.reject(new Error("查询核销单错误"));
        }
    }

    public async find(findDto: AccountsVerifySheetFindDto) {
        const conn = this.mysqldbAls.getConnectionInAls();
        let sql = ` SELECT
                        accounts_verify_sheet.accountsVerifySheetId,
                        accounts_verify_sheet.accountsVerifySheetCode,
                        accounts_verify_sheet.sheetType,
                        accounts_verify_sheet.inDate,
                        accounts_verify_sheet.clientid,
                        accounts_verify_sheet.clientid_b,
                        accounts_verify_sheet.buyid,
                        accounts_verify_sheet.buyid_b,
                        accounts_verify_sheet.creater,
                        accounts_verify_sheet.createdAt,
                        accounts_verify_sheet.updater,
                        accounts_verify_sheet.updatedAt,
                        accounts_verify_sheet.level1Review,
                        accounts_verify_sheet.level1Name,
                        accounts_verify_sheet.level1Date,
                        accounts_verify_sheet.level2Review,
                        accounts_verify_sheet.level2Name,
                        accounts_verify_sheet.level2Date,
                        accounts_verify_sheet.del_uuid,
                        accounts_verify_sheet.deleter,
                        accounts_verify_sheet.deleteAt,
                        accounts_verify_sheet.reMark1,
                        accounts_verify_sheet.reMark2,
                        accounts_verify_sheet.reMark3,
                        client.clientname,
                        client_b.clientname as clientname_b,
                        buy.buyname,
                        buy_b.buyname as buyname_b
                     FROM
                        accounts_verify_sheet
                        LEFT JOIN client ON client.clientid = accounts_verify_sheet.clientid 
                        LEFT JOIN client as client_b ON client_b.clientid = accounts_verify_sheet.clientid_b 
                        LEFT JOIN buy ON buy.buyid = accounts_verify_sheet.buyid 
                        LEFT JOIN buy as buy_b ON buy_b.buyid = accounts_verify_sheet.buyid_b
                     WHERE
                        accounts_verify_sheet.del_uuid = 0`;
        const params = [];

        if (findDto.accountsVerifySheetCode.length > 0) {
            sql = sql + ` AND accounts_verify_sheet.accountsVerifySheetCode = ?`;
            params.push(findDto.accountsVerifySheetCode);
        }

        if (findDto.accountsVerifySheetId) {
            sql = sql + ` AND accounts_verify_sheet.accountsVerifySheetId = ?`;
            params.push(findDto.accountsVerifySheetId);
        }

        if (findDto.sheetType) {
            sql = sql + ` AND accounts_verify_sheet.sheetType = ?`;
            params.push(findDto.sheetType);
        }

        if (findDto.buyid) {
            sql = sql + ` AND accounts_verify_sheet.buyid = ?`;
            params.push(findDto.buyid);
        }

        if (findDto.buyid_b) {
            sql = sql + ` AND accounts_verify_sheet.buyid_b = ?`;
            params.push(findDto.buyid_b);
        }

        if (findDto.clientid) {
            sql = sql + ` AND accounts_verify_sheet.clientid = ?`;
            params.push(findDto.clientid);
        }

        if (findDto.clientid_b) {
            sql = sql + ` AND accounts_verify_sheet.clientid_b = ?`;
            params.push(findDto.clientid_b);
        }

        if (findDto.startDate.length > 0 && findDto.endDate.length > 0) {
            sql = sql + ` AND DATE(accounts_verify_sheet.inDate) BETWEEN ? AND ?`;
            params.push(findDto.startDate, findDto.endDate);
        }

        //分页查询
        if (findDto.page > 0 && findDto.pagesize > 0) {
            sql = sql + ` LIMIT ?,?`;
            params.push(findDto.page, findDto.pagesize);
        }

        const [res] = await conn.query(sql, params);
        if ((res as IAccountsVerifySheetFind[]).length > 0) {
            return (res as IAccountsVerifySheetFind[])
        } else {
            return [];
        }
    }

    public async create(accountsVerifySheet: IAccountsVerifySheet) {
        console.log(accountsVerifySheet)
        const conn = this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO accounts_verify_sheet (
                        accounts_verify_sheet.accountsVerifySheetCode,
                        accounts_verify_sheet.sheetType,
                        accounts_verify_sheet.inDate,
                        accounts_verify_sheet.clientid,
                        accounts_verify_sheet.clientid_b,
                        accounts_verify_sheet.buyid,
                        accounts_verify_sheet.buyid_b,
                        accounts_verify_sheet.creater,
                        accounts_verify_sheet.createdAt,
                        accounts_verify_sheet.reMark1,
                        accounts_verify_sheet.reMark2,
                        accounts_verify_sheet.reMark3
                     ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            accountsVerifySheet.accountsVerifySheetCode,
            accountsVerifySheet.sheetType,
            accountsVerifySheet.inDate,
            accountsVerifySheet.clientid,
            accountsVerifySheet.clientid_b,
            accountsVerifySheet.buyid,
            accountsVerifySheet.buyid_b,
            accountsVerifySheet.creater,
            accountsVerifySheet.createdAt,
            accountsVerifySheet.reMark1,
            accountsVerifySheet.reMark2,
            accountsVerifySheet.reMark3
        ]]]);

        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("保存核销单失败"));
        }
    }

    public async update(accountsVerifySheet: IAccountsVerifySheet) {
        const conn = this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        accounts_verify_sheet 
                     SET
                        accounts_verify_sheet.sheetType = ?,
                        accounts_verify_sheet.inDate = ?,
                        accounts_verify_sheet.clientid = ?,
                        accounts_verify_sheet.clientid_b = ?,
                        accounts_verify_sheet.buyid = ?,
                        accounts_verify_sheet.buyid_b = ?,
                        accounts_verify_sheet.updater = ?,
                        accounts_verify_sheet.updatedAt = ?,
                        accounts_verify_sheet.reMark1 = ?,
                        accounts_verify_sheet.reMark2 = ?,
                        accounts_verify_sheet.reMark3 = ?
                     WHERE
                        accounts_verify_sheet.del_uuid = 0
                        AND accounts_verify_sheet.accountsVerifySheetId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountsVerifySheet.sheetType,
            accountsVerifySheet.inDate,
            accountsVerifySheet.clientid,
            accountsVerifySheet.clientid_b,
            accountsVerifySheet.buyid,
            accountsVerifySheet.buyid_b,
            accountsVerifySheet.updater,
            accountsVerifySheet.updatedAt,
            accountsVerifySheet.reMark1,
            accountsVerifySheet.reMark2,
            accountsVerifySheet.reMark3,
            accountsVerifySheet.accountsVerifySheetId
        ]);

        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新核销单失败"));
        }
    }

    public async delete_data(accountsVerifySheetId: number, userName: string) {
        const conn = this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        accounts_verify_sheet 
                     SET
                        accounts_verify_sheet.del_uuid = ?,
                        accounts_verify_sheet.deleter = ?,
                        accounts_verify_sheet.deleteAt = ?
                     WHERE
                        accounts_verify_sheet.del_uuid = 0
                        AND accounts_verify_sheet.accountsVerifySheetId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountsVerifySheetId,
            userName,
            new Date(),
            accountsVerifySheetId
        ]);

        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("删除核销单失败"));
        }
    }

    public async level1Review(accountsVerifySheetId: number, userName: string) {
        const conn = this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        accounts_verify_sheet 
                     SET
                        accounts_verify_sheet.level1Review = 1,
                        accounts_verify_sheet.level1Name = ?,
                        accounts_verify_sheet.level1Date = ?
                     WHERE
                        accounts_verify_sheet.del_uuid = 0
                        AND accounts_verify_sheet.accountsVerifySheetId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            userName,
            new Date(),
            accountsVerifySheetId
        ]);

        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("审核核销单失败"));
        }
    }

    public async unLevel1Review(accountsVerifySheetId: number) {
        const conn = this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        accounts_verify_sheet 
                     SET
                        accounts_verify_sheet.level1Review = 0,
                        accounts_verify_sheet.level1Name = '',
                        accounts_verify_sheet.level1date = null
                     WHERE
                        accounts_verify_sheet.del_uuid = 0
                        AND accounts_verify_sheet.accountsVerifySheetId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountsVerifySheetId
        ]);

        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("撤审销单失败"));
        }
    }
}