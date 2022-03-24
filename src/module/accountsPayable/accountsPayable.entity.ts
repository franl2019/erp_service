import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountsPayable, IAccountsPayableFind} from "./accountsPayable";
import {AccountsPayableFindDto} from "./dto/accountsPayableFind.dto";
import {ResultSetHeader} from "mysql2/promise";
import {Injectable} from "@nestjs/common";

@Injectable()
export class AccountsPayableEntity {

    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async findById(accountsPayableId: number): Promise<IAccountsPayable> {
        const conn = this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT
                                accounts_payable.accountsPayableId,
                                accounts_payable.buyid,
                                accounts_payable.inDate,
                                accounts_payable.amounts,
                                accounts_payable.checkedAmounts,
                                accounts_payable.notCheckAmounts,
                                accounts_payable.correlationId,
                                accounts_payable.correlationType,
                                accounts_payable.creater,
                                accounts_payable.createdAt,
                                accounts_payable.updater,
                                accounts_payable.updatedAt,
                                accounts_payable.del_uuid,
                                accounts_payable.deleter,
                                accounts_payable.deletedAt
                            FROM
                                accounts_payable
                            WHERE
                                accounts_payable.del_uuid = 0
                                AND accounts_payable.accountsPayableId = ?`;
        const [res] = await conn.query(sql, [accountsPayableId]);
        if ((res as IAccountsPayable[]).length > 0) {
            return (res as IAccountsPayable[])[0];
        } else {
            return Promise.reject(new Error("查询应付账款错误"));
        }
    }

    public async find(findDto: AccountsPayableFindDto): Promise<IAccountsPayableFind[]> {
        const conn = this.mysqldbAls.getConnectionInAls();
        let sql: string = `SELECT
                                accounts_payable.accountsPayableId,
                                accounts_payable.buyid,
                                accounts_payable.inDate,
                                accounts_payable.amounts,
                                accounts_payable.checkedAmounts,
                                accounts_payable.notCheckAmounts,
                                accounts_payable.correlationId,
                                accounts_payable.correlationType,
                                accounts_payable.creater,
                                accounts_payable.createdAt,
                                accounts_payable.updater,
                                accounts_payable.updatedAt,
                                accounts_payable.del_uuid,
                                accounts_payable.deleter,
                                accounts_payable.deletedAt,
                                buy.buyname
                            FROM
                                accounts_payable
                                LEFT JOIN buy ON buy.buyid = accounts_payable.buyid
                            WHERE
                                accounts_payable.del_uuid = 0`;
        const params = [];
        if (findDto.buyid) {
            sql = sql + ` AND accounts_payable.buyid = ?`
            params.push(findDto.buyid);
        }

        if (findDto.accountsPayableId) {
            sql = sql + ` AND accounts_payable.accountsPayableId = ?`;
            params.push(findDto.accountsPayableId);
        }

        if (findDto.accountsPayableType) {
            sql = sql + ` AND accounts_payable.accountsPayableType = ?`;
            params.push(findDto.accountsPayableType);
        }

        if (findDto.correlationId&&findDto.correlationType) {
            sql = sql + ` AND accounts_payable.correlationId = ?`;
            sql = sql + ` AND accounts_payable.correlationType = ?`;
            params.push(findDto.correlationId,findDto.correlationType);
        }

        //按出仓日期范围查询
        if (findDto.startDate.length > 0 && findDto.endDate.length > 0) {
            sql = sql + ` AND DATE(accounts_payable.inDate) BETWEEN ? AND ?`;
            params.push(findDto.startDate, findDto.endDate);
        }

        //分页查询
        if (findDto.page > 0 && findDto.pagesize > 0) {
            sql = sql + ` LIMIT ?,?`;
            params.push(findDto.page, findDto.pagesize);
        }

        const [res] = await conn.query(sql, params);
        if ((res as IAccountsPayableFind[]).length > 0) {
            return (res as IAccountsPayableFind[])
        } else {
            return [];
        }
    }

    public async create(accountsPayable: IAccountsPayable) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO accounts_payable (
                        accounts_payable.accountsPayableId,
                        accounts_payable.buyid,
                        accounts_payable.inDate,
                        accounts_payable.amounts,
                        accounts_payable.checkedAmounts,
                        accounts_payable.notCheckAmounts,
                        accounts_payable.correlationId,
                        accounts_payable.correlationType,
                        accounts_payable.creater,
                        accounts_payable.createdAt) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            accountsPayable.accountsPayableId,
            accountsPayable.buyid,
            accountsPayable.inDate,
            accountsPayable.amounts,
            accountsPayable.checkedAmounts,
            accountsPayable.notCheckAmounts,
            accountsPayable.correlationId,
            accountsPayable.correlationType,
            accountsPayable.creater,
            accountsPayable.createdAt
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('新增应付账款失败'));
        }
    }

    public async update(accountsPayable: IAccountsPayable) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        accounts_payable 
                     SET
                        accounts_payable.checkedAmounts = ?,
                        accounts_payable.notCheckAmounts = ?,
                        accounts_payable.updater = ?,
                        accounts_payable.updatedAt = ?
                     WHERE 
                        accounts_payable.del_uuid = 0
                        AND accounts_payable.accountsPayableId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountsPayable.checkedAmounts,
            accountsPayable.notCheckAmounts,
            accountsPayable.updater,
            accountsPayable.updatedAt,
            accountsPayable.accountsPayableId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('更新应付账款失败'));
        }
    }

    public async deleteById(accountsPayableId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM
                        accounts_payable
                     WHERE
                        accounts_payable.del_uuid = 0
                        AND accounts_payable.accountsPayableId = ?`
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountsPayableId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除应付账款失败'));
        }
    }
}