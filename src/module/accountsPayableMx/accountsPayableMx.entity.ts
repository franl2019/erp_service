import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountsPayableMx} from "./accountsPayableMx";
import {ResultSetHeader} from "mysql2/promise";
import {AccountsPayableFindDto} from "./dto/accountsPayableFind.dto";

@Injectable()
export class AccountsPayableMxEntity {

    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async findById(accountsPayableMxId: number): Promise<IAccountsPayableMx> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        accounts_payable_mx.accountsPayableMxId,
                        accounts_payable_mx.accountsPayableId,
                        accounts_payable_mx.correlationId,
                        accounts_payable_mx.correlationType,
                        accounts_payable_mx.inDate,
                        accounts_payable_mx.advancesPayment,
                        accounts_payable_mx.accountPayable,
                        accounts_payable_mx.actuallyPayment,
                        accounts_payable_mx.abstract,
                        accounts_payable_mx.reMark,
                        accounts_payable_mx.creater,
                        accounts_payable_mx.createdAt,
                        accounts_payable_mx.updater,
                        accounts_payable_mx.updatedAt
                     FROM
                        accounts_payable_mx
                     WHERE
                        accounts_payable_mx.accountsPayableMxId = ?`;
        const [res] = await conn.query(sql, [accountsPayableMxId]);
        if ((res as IAccountsPayableMx[]).length > 0) {
            return (res as IAccountsPayableMx[])[0];
        } else {
            return Promise.reject(new Error('查询应付账款明细失败'));
        }
    }

    public async find(accountsPayableFindDto: AccountsPayableFindDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        accounts_payable_mx.accountsPayableMxId,
                        accounts_payable_mx.accountsPayableId,
                        accounts_payable_mx.correlationId,
                        accounts_payable_mx.correlationType,
                        accounts_payable_mx.inDate,
                        accounts_payable_mx.advancesPayment,
                        accounts_payable_mx.accountPayable,
                        accounts_payable_mx.actuallyPayment,
                        accounts_payable_mx.abstract,
                        accounts_payable_mx.reMark,
                        accounts_payable_mx.creater,
                        accounts_payable_mx.createdAt,
                        accounts_payable_mx.updater,
                        accounts_payable_mx.updatedAt
                     FROM
                        accounts_payable_mx
                     WHERE
                        accounts_payable_mx.accountsPayableId = ?`;
        const [res] = await conn.query(sql, [accountsPayableFindDto.accountsPayableId]);
        if ((res as IAccountsPayableMx[]).length > 0) {
            return (res as IAccountsPayableMx[])[0];
        } else {
            return Promise.reject(new Error('查询应付账款明细失败'));
        }
    }

    public async create(accountsPayableMx: IAccountsPayableMx) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO accounts_payable_mx (
                        accounts_payable_mx.accountsPayableId,
                        accounts_payable_mx.correlationId,
                        accounts_payable_mx.correlationType,
                        accounts_payable_mx.inDate,
                        accounts_payable_mx.advancesPayment,
                        accounts_payable_mx.accountPayable,
                        accounts_payable_mx.actuallyPayment,
                        accounts_payable_mx.abstract,
                        accounts_payable_mx.reMark,
                        accounts_payable_mx.creater,
                        accounts_payable_mx.createdAt
        ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            accountsPayableMx.accountsPayableId,
            accountsPayableMx.correlationId,
            accountsPayableMx.correlationType,
            accountsPayableMx.inDate,
            accountsPayableMx.advancesPayment,
            accountsPayableMx.accountPayable,
            accountsPayableMx.actuallyPayment,
            accountsPayableMx.abstract,
            accountsPayableMx.reMark,
            accountsPayableMx.creater,
            accountsPayableMx.createdAt
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('新增应付账款失败'))
        }
    }

    public async deleteById(accountsPayableId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM accounts_payable_mx 
                     WHERE 
                        accounts_payable_mx.accountsPayableId = ?`
        const [res] = await conn.query<ResultSetHeader>(sql, [accountsPayableId]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除应付账款失败'))
        }
    }

    public async deleteByCorrelation(correlationId: number,correlationType:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM accounts_payable_mx 
                     WHERE 
                        accounts_payable_mx.correlationId = ?
                        AND accounts_payable_mx.correlationType = ?`
        const [res] = await conn.query<ResultSetHeader>(sql, [correlationId,correlationType]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除应付账款失败'))
        }
    }

}