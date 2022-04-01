import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountsReceivableSubjectMx} from "./accountsReceivableSubjectMx";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class AccountsReceivableSubjectMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findById(accountsReceivableId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT 
                        accounts_receivable_subject_mx.accountsReceivableSubjectMxId,
                        accounts_receivable_subject_mx.accountsReceivableId,
                        accounts_receivable_subject_mx.correlationId,
                        accounts_receivable_subject_mx.correlationType,
                        accounts_receivable_subject_mx.inDate,
                        accounts_receivable_subject_mx.debit,
                        accounts_receivable_subject_mx.credit,
                        accounts_receivable_subject_mx.creater,
                        accounts_receivable_subject_mx.createdAt,
                        accounts_receivable_subject_mx.abstract,
                        accounts_receivable_subject_mx.reMark
                     FROM
                        accounts_receivable_subject_mx
                     WHERE
                        accounts_receivable_subject_mx.accountsReceivableId = ?`;
        const [res] = await conn.query(sql, [accountsReceivableId]);
        if ((res as IAccountsReceivableSubjectMx[]).length > 0) {
            return (res as IAccountsReceivableSubjectMx[]);
        } else {
            return Promise.reject(new Error('查询应收账款科目明细失败'));
        }
    }

    public async create(accountsReceivableSubjectMx: IAccountsReceivableSubjectMx) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO accounts_receivable_subject_mx (
                        accounts_receivable_subject_mx.accountsReceivableId,
                        accounts_receivable_subject_mx.correlationId,
                        accounts_receivable_subject_mx.correlationType,
                        accounts_receivable_subject_mx.inDate,
                        accounts_receivable_subject_mx.debit,
                        accounts_receivable_subject_mx.credit,
                        accounts_receivable_subject_mx.creater,
                        accounts_receivable_subject_mx.createdAt,
                        accounts_receivable_subject_mx.abstract,
                        accounts_receivable_subject_mx.reMark
                    ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
                accountsReceivableSubjectMx.accountsReceivableId,
                accountsReceivableSubjectMx.correlationId,
                accountsReceivableSubjectMx.correlationType,
                accountsReceivableSubjectMx.inDate,
                accountsReceivableSubjectMx.debit,
                accountsReceivableSubjectMx.credit,
                accountsReceivableSubjectMx.creater,
                accountsReceivableSubjectMx.createdAt,
                accountsReceivableSubjectMx.abstract,
                accountsReceivableSubjectMx.reMark
            ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('新增应收账款科目明细失败'));
        }
    }

    public async deleteById(accountsReceivableId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM accounts_receivable_subject_mx WHERE accounts_receivable_subject_mx.accountsReceivableId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [accountsReceivableId]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除应收账款科目明细失败'));
        }
    }

    public async deleteByCorrelation(correlationId: number, correlationType: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM 
                         accounts_receivable_subject_mx 
                     WHERE 
                         accounts_receivable_subject_mx.correlationId = ?
                         AND accounts_receivable_subject_mx.correlationType = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [correlationId, correlationType]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除应收账款科目明细失败'));
        }
    }

}