import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountsReceivableMx} from "./accountsReceivableMx";
import {ResultSetHeader} from "mysql2/promise";
import {AccountsReceivableFindDto} from "./dto/accountsReceivableFind.dto";

@Injectable()
export class AccountsReceivableMxEntity {

    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async findById(accountReceivableMxId: number): Promise<IAccountsReceivableMx> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        accounts_receivable_mx.accountReceivableMxId,
                        accounts_receivable_mx.accountsReceivableId,
                        accounts_receivable_mx.correlationId,
                        accounts_receivable_mx.correlationType,
                        accounts_receivable_mx.inDate,
                        accounts_receivable_mx.advancesReceived,
                        accounts_receivable_mx.receivables,
                        accounts_receivable_mx.actuallyReceived,
                        accounts_receivable_mx.abstract,
                        accounts_receivable_mx.reMark,
                        accounts_receivable_mx.creater,
                        accounts_receivable_mx.createdAt,
                        accounts_receivable_mx.updater,
                        accounts_receivable_mx.updatedAt
                     FROM
                        accounts_receivable_mx
                     WHERE
                        accounts_receivable_mx.accountReceivableMxId = ?`;
        const [res] = await conn.query(sql, [accountReceivableMxId]);
        if ((res as IAccountsReceivableMx[]).length > 0) {
            return (res as IAccountsReceivableMx[])[0];
        } else {
            return Promise.reject(new Error('查询应收账款明细失败'));
        }
    }

    public async find(accountsReceivableFindDto: AccountsReceivableFindDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        accounts_receivable_mx.accountReceivableMxId,
                        accounts_receivable_mx.accountsReceivableId,
                        accounts_receivable_mx.correlationId,
                        accounts_receivable_mx.correlationType,
                        accounts_receivable_mx.inDate,
                        accounts_receivable_mx.advancesReceived,
                        accounts_receivable_mx.receivables,
                        accounts_receivable_mx.actuallyReceived,
                        accounts_receivable_mx.abstract,
                        accounts_receivable_mx.reMark,
                        accounts_receivable_mx.creater,
                        accounts_receivable_mx.createdAt,
                        accounts_receivable_mx.updater,
                        accounts_receivable_mx.updatedAt
                     FROM
                        accounts_receivable_mx
                     WHERE
                        accounts_receivable_mx.accountsReceivableId = ?`;
        const [res] = await conn.query(sql, [accountsReceivableFindDto.accountsReceivableId]);
        if ((res as IAccountsReceivableMx[]).length > 0) {
            return (res as IAccountsReceivableMx[])[0];
        } else {
            return Promise.reject(new Error('查询应收账款明细失败'));
        }
    }

    public async create(accountsReceivableMx: IAccountsReceivableMx) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO accounts_receivable_mx (
                        accounts_receivable_mx.accountsReceivableId,
                        accounts_receivable_mx.correlationId,
                        accounts_receivable_mx.correlationType,
                        accounts_receivable_mx.inDate,
                        accounts_receivable_mx.advancesReceived,
                        accounts_receivable_mx.receivables,
                        accounts_receivable_mx.actuallyReceived,
                        accounts_receivable_mx.abstract,
                        accounts_receivable_mx.reMark,
                        accounts_receivable_mx.creater,
                        accounts_receivable_mx.createdAt
        ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            accountsReceivableMx.accountsReceivableId,
            accountsReceivableMx.correlationId,
            accountsReceivableMx.correlationType,
            accountsReceivableMx.inDate,
            accountsReceivableMx.advancesReceived,
            accountsReceivableMx.receivables,
            accountsReceivableMx.actuallyReceived,
            accountsReceivableMx.abstract,
            accountsReceivableMx.reMark,
            accountsReceivableMx.creater,
            accountsReceivableMx.createdAt
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('新增应收账款失败'))
        }
    }

    public async delete_data(correlationId: number, correlationType: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM accounts_receivable_mx 
                     WHERE 
                        accounts_receivable_mx.correlationId = ?
                        AND accounts_receivable_mx.correlationType = ?`
        const [res] = await conn.query<ResultSetHeader>(sql, [correlationId, correlationType]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除应收账款失败'))
        }
    }

}