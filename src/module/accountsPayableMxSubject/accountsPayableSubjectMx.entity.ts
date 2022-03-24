import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {Injectable} from "@nestjs/common";
import {IAccountsPayableSubjectMx} from "./accountsPayableSubjectMx";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class AccountsPayableSubjectMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async find(accountsPayableId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        accounts_payable_subject_mx.accountsPayableSubjectMxId,
                        accounts_payable_subject_mx.accountsPayableId,
                        accounts_payable_subject_mx.correlationId,
                        accounts_payable_subject_mx.correlationType,
                        accounts_payable_subject_mx.inDate,
                        accounts_payable_subject_mx.debit,
                        accounts_payable_subject_mx.credit,
                        accounts_payable_subject_mx.creater,
                        accounts_payable_subject_mx.createdAt,
                        accounts_payable_subject_mx.abstract,
                        accounts_payable_subject_mx.reMark,
                     FROM accounts_payable_subject_mx
                     WHERE accounts_payable_subject_mx.accountsPayableId = ?`;
        const [res] = await conn.query(sql, [accountsPayableId]);
        if ((res as IAccountsPayableSubjectMx[]).length > 0) {
            return (res as IAccountsPayableSubjectMx[]);
        } else {
            return Promise.reject(new Error('查询应付账款科目明细失败'))
        }
    }

    public async create(accountsPayableSubjectMx: IAccountsPayableSubjectMx) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO accounts_payable_subject_mx (
                        accounts_payable_subject_mx.accountsPayableSubjectMxId,
                        accounts_payable_subject_mx.accountsPayableId,
                        accounts_payable_subject_mx.correlationId,
                        accounts_payable_subject_mx.correlationType,
                        accounts_payable_subject_mx.inDate,
                        accounts_payable_subject_mx.debit,
                        accounts_payable_subject_mx.credit,
                        accounts_payable_subject_mx.creater,
                        accounts_payable_subject_mx.createdAt,
                        accounts_payable_subject_mx.abstract,
                        accounts_payable_subject_mx.reMark
                    ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountsPayableSubjectMx.accountsPayableSubjectMxId,
            accountsPayableSubjectMx.accountsPayableId,
            accountsPayableSubjectMx.correlationId,
            accountsPayableSubjectMx.correlationType,
            accountsPayableSubjectMx.inDate,
            accountsPayableSubjectMx.debit,
            accountsPayableSubjectMx.credit,
            accountsPayableSubjectMx.creater,
            accountsPayableSubjectMx.createdAt,
            accountsPayableSubjectMx.abstract,
            accountsPayableSubjectMx.reMark,
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('新增应付账款科目明细失败'));
        }
    }

    public async deleteById(accountsPayableId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM accounts_payable_subject_mx 
                     WHERE accounts_payable_subject_mx.accountsPayableId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [accountsPayableId]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除应付账款科目明细失败'));
        }
    }

    public async deleteByCorrelation(correlationId: number, correlationType: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM accounts_payable_subject_mx 
                     WHERE accounts_payable_subject_mx.correlationId = ?
                     AND accounts_payable_subject_mx.correlationType = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [correlationId, correlationType]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除应付账款科目明细失败'));
        }
    }

}