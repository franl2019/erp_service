import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountInComeSheetMx} from "./accountInComeSheetMx";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class AccountInComeSheetMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findById(accountInComeId: number): Promise<IAccountInComeSheetMx[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT 
                        account_income_sheet_mx.accountInComeSheetMxId,
                        account_income_sheet_mx.accountInComeId,
                        account_income_sheet_mx.printId,
                        account_income_sheet_mx.amounts,
                        account_income_sheet_mx.amountsVerified,
                        account_income_sheet_mx.amountsNotVerify,
                        account_income_sheet_mx.amountsMantissa,
                        account_income_sheet_mx.amountsThisVerify,
                        account_income_sheet_mx.correlationId,
                        account_income_sheet_mx.correlationType
                     FROM
                        account_income_sheet_mx
                     WHERE
                        account_income_sheet_mx.accountInComeId = ?`;
        const [res] = await conn.query(sql, [accountInComeId]);
        if ((res as IAccountInComeSheetMx[]).length > 0) {
            return (res as IAccountInComeSheetMx[])
        } else {
            return Promise.reject(new Error('查询收款单单据明细失败,ById'));
        }
    }

    public async create(accountInComeSheetMxList: IAccountInComeSheetMx[]) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO account_income_sheet_mx (
                        account_income_sheet_mx.accountInComeId = ?,
                        account_income_sheet_mx.printId = ?,
                        account_income_sheet_mx.amounts = ?,
                        account_income_sheet_mx.amountsVerified = ?,
                        account_income_sheet_mx.amountsNotVerify = ?,
                        account_income_sheet_mx.amountsMantissa,
                        account_income_sheet_mx.amountsThisVerify = ?,
                        account_income_sheet_mx.correlationId = ?,
                        account_income_sheet_mx.correlationType = ?
                    ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [accountInComeSheetMxList.map(accountInComeSheetMx =>
            [
                accountInComeSheetMx.accountInComeId,
                accountInComeSheetMx.printId,
                accountInComeSheetMx.amounts,
                accountInComeSheetMx.amountsVerified,
                accountInComeSheetMx.amountsNotVerify,
                accountInComeSheetMx.amountsMantissa,
                accountInComeSheetMx.amountsThisVerify,
                accountInComeSheetMx.correlationId,
                accountInComeSheetMx.correlationType
            ]
        )]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('新增收款单单据明细失败'));
        }
    }

    public async deleteById(accountInComeId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM account_income_sheet_mx WHERE account_income_sheet_mx.accountInComeId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [accountInComeId]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除收款单单据明细失败'));
        }
    }
}