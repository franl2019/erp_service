import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountExpenditureAmountMx} from "./accountExpenditureAmountMx";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class AccountExpenditureAmountMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findById(accountExpenditureId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        account_expenditure_amount_mx.accountExpenditureAmountMxId,
                        account_expenditure_amount_mx.accountExpenditureId,
                        account_expenditure_amount_mx.printId,
                        account_expenditure_amount_mx.accountId,
                        account_expenditure_amount_mx.amount,
                        account_expenditure_amount_mx.receivingAccount,
                        account_expenditure_amount_mx.payee,
                        account_expenditure_amount_mx.reMark1,
                        account_expenditure_amount_mx.reMark2,
                        account_expenditure_amount_mx.reMark3,
                        account.accountName
                     FROM
                        account_expenditure_amount_mx
                        left join account on account_expenditure_amount_mx.accountId = account.accountId
                     WHERE
                        account_expenditure_amount_mx.accountExpenditureId = ?`;
        const [res] = await conn.query(sql, [accountExpenditureId]);
        if ((res as IAccountExpenditureAmountMx[]).length > 0) {
            return res as IAccountExpenditureAmountMx[];
        } else {
            return [];
        }
    }

    public async create(accountExpenditureAmountMxList: IAccountExpenditureAmountMx[]) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO account_expenditure_amount_mx (
                        account_expenditure_amount_mx.accountExpenditureAmountMxId,
                        account_expenditure_amount_mx.accountExpenditureId,
                        account_expenditure_amount_mx.printId,
                        account_expenditure_amount_mx.accountId,
                        account_expenditure_amount_mx.amount,
                        account_expenditure_amount_mx.receivingAccount,
                        account_expenditure_amount_mx.payee,
                        account_expenditure_amount_mx.reMark1,
                        account_expenditure_amount_mx.reMark2,
                        account_expenditure_amount_mx.reMark3
                    ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountExpenditureAmountMxList.map(accountExpenditureAmountMx => [
                accountExpenditureAmountMx.accountExpenditureAmountMxId,
                accountExpenditureAmountMx.accountExpenditureId,
                accountExpenditureAmountMx.printId,
                accountExpenditureAmountMx.accountId,
                accountExpenditureAmountMx.amount,
                accountExpenditureAmountMx.receivingAccount,
                accountExpenditureAmountMx.payee,
                accountExpenditureAmountMx.reMark1,
                accountExpenditureAmountMx.reMark2,
                accountExpenditureAmountMx.reMark3
            ])
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('新增支出单出纳明细失败'));
        }
    }

    public async deleteById(accountExpenditureId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM account_expenditure_amount_mx WHERE account_expenditure_amount_mx.accountExpenditureId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [accountExpenditureId]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('删除支出单出纳明细失败'));
        }
    }
}