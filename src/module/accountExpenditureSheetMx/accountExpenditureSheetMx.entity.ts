import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountExpenditureSheetMx} from "./accountExpenditureSheetMx";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class AccountExpenditureSheetMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findById(accountExpenditureId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        account_expenditure_sheet_mx.accountExpenditureSheetMxId,
                        account_expenditure_sheet_mx.accountExpenditureId,
                        account_expenditure_sheet_mx.printId,
                        account_expenditure_sheet_mx.amounts,
                        account_expenditure_sheet_mx.amountsVerified,
                        account_expenditure_sheet_mx.amountsNotVerify,
                        account_expenditure_sheet_mx.amountsMantissa,
                        account_expenditure_sheet_mx.amountsThisVerify,
                        account_expenditure_sheet_mx.correlationId,
                        account_expenditure_sheet_mx.correlationType
                     FROM
                        account_expenditure_sheet_mx
                     WHERE
                        account_expenditure_sheet_mx.accountExpenditureId = ?`;
        const [res] = await conn.query(sql, [accountExpenditureId]);
        if ((res as IAccountExpenditureSheetMx[]).length > 0) {
            return (res as IAccountExpenditureSheetMx[])
        } else {
            return []
        }
    }

    public async create(account_expenditure_sheet_mx: IAccountExpenditureSheetMx) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO account_expenditure_sheet_mx (
                        account_expenditure_sheet_mx.accountExpenditureSheetMxId,
                        account_expenditure_sheet_mx.accountExpenditureId,
                        account_expenditure_sheet_mx.printId,
                        account_expenditure_sheet_mx.amounts,
                        account_expenditure_sheet_mx.amountsVerified,
                        account_expenditure_sheet_mx.amountsNotVerify,
                        account_expenditure_sheet_mx.amountsMantissa,
                        account_expenditure_sheet_mx.amountsThisVerify,
                        account_expenditure_sheet_mx.correlationId,
                        account_expenditure_sheet_mx.correlationType
            ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            account_expenditure_sheet_mx.accountExpenditureSheetMxId,
            account_expenditure_sheet_mx.accountExpenditureId,
            account_expenditure_sheet_mx.printId,
            account_expenditure_sheet_mx.amounts,
            account_expenditure_sheet_mx.amountsVerified,
            account_expenditure_sheet_mx.amountsNotVerify,
            account_expenditure_sheet_mx.amountsMantissa,
            account_expenditure_sheet_mx.amountsThisVerify,
            account_expenditure_sheet_mx.correlationId,
            account_expenditure_sheet_mx.correlationType
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('新增支出单核销明细失败'));
        }
    }

    public async deleteById(accountExpenditureId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM account_expenditure_sheet_mx WHERE account_expenditure_sheet_mx.accountExpenditureId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [accountExpenditureId]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除支出单核销明细失败'));
        }
    }
}