import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountsVerifySheetMx} from "./accountsVerifySheetMx";
import {Injectable} from "@nestjs/common";
import {ResultSetHeader} from "mysql2/promise";
import {AccountsVerifySheetMxFindDto} from "./dto/accountsVerifySheetMxFind.dto";

@Injectable()
export class AccountsVerifySheetMxEntity {

    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async find(accountsVerifySheetMxFindDto: AccountsVerifySheetMxFindDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT 
                        accounts_verify_sheet_mx.accountsVerifySheetMxId,
                        accounts_verify_sheet_mx.accountsVerifySheetId,
                        accounts_verify_sheet_mx.amounts,
                        accounts_verify_sheet_mx.amountsVerified,
                        accounts_verify_sheet_mx.amountsNotVerify,
                        accounts_verify_sheet_mx.amountsMantissa,
                        accounts_verify_sheet_mx.amountsThisVerify,
                        accounts_verify_sheet_mx.correlationId,
                        accounts_verify_sheet_mx.correlationType
                     FROM
                        accounts_verify_sheet_mx
                     WHERE
                        accounts_verify_sheet_mx.accountsVerifySheetId = ?
                        AND accounts_verify_sheet_mx.del_uuid = 0`;
        const params = [accountsVerifySheetMxFindDto.accountsVerifySheetId]

        if (accountsVerifySheetMxFindDto.accountsVerifySheetMxId) {
            sql = sql + ` AND accounts_verify_sheet_mx.accountsVerifySheetMxId = ?`;
            params.push(accountsVerifySheetMxFindDto.accountsVerifySheetMxId)
        }
        const [res] = await conn.query(sql, [params]);
        if ((res as IAccountsVerifySheetMx[]).length) {
            return (res as IAccountsVerifySheetMx[])
        } else {
            return Promise.reject(new Error("查询核销单明细失败"));
        }
    }

    public async create(accountsVerifySheetMxList: IAccountsVerifySheetMx[]) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO accounts_verify_sheet_mx (
                        accounts_verify_sheet_mx.accountsVerifySheetMxId,
                        accounts_verify_sheet_mx.accountsVerifySheetId,
                        accounts_verify_sheet_mx.amounts,
                        accounts_verify_sheet_mx.amountsVerified,
                        accounts_verify_sheet_mx.amountsNotVerify,
                        accounts_verify_sheet_mx.amountsMantissa,
                        accounts_verify_sheet_mx.amountsThisVerify,
                        accounts_verify_sheet_mx.correlationId,
                        accounts_verify_sheet_mx.correlationType
                     ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [accountsVerifySheetMxList.map(accounts_verify_sheet_mx => [
            accounts_verify_sheet_mx.accountsVerifySheetMxId,
            accounts_verify_sheet_mx.accountsVerifySheetId,
            accounts_verify_sheet_mx.amounts,
            accounts_verify_sheet_mx.amountsVerified,
            accounts_verify_sheet_mx.amountsNotVerify,
            accounts_verify_sheet_mx.amountsMantissa,
            accounts_verify_sheet_mx.amountsThisVerify,
            accounts_verify_sheet_mx.correlationId,
            accounts_verify_sheet_mx.correlationType
        ])]);

        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('新增核销单明细失败'));
        }
    }

    public async delete_data(accountsVerifySheetId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM accounts_verify_sheet_mx
                     WHERE 
                        accounts_verify_sheet_mx.accountsVerifySheetId = ?
                        AND accounts_verify_sheet_mx.del_uuid = 0
                        AND accounts_verify_sheet_mx.level1Review = 0
                        AND accounts_verify_sheet_mx.level2Review = 0`;
        const [res] = await conn.query<ResultSetHeader>(sql, [accountsVerifySheetId]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除核销单明细失败'));
        }
    }
}