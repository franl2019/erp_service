import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountsReceivable, IAccountsReceivableFind} from "./accountsReceivable";
import {AccountsReceivableFindDto} from "./dto/accountsReceivableFind.dto";
import {ResultSetHeader} from "mysql2/promise";
import {Injectable} from "@nestjs/common";
import {AccountCategoryType} from "../accountsVerifySheetMx/accountCategoryType";
import { CodeType } from "../autoCode/codeType";

@Injectable()
export class AccountsReceivableEntity {

    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async findById(accountsReceivableId: number): Promise<IAccountsReceivable> {
        const conn = this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT
                                accounts_receivable.accountsReceivableId,
                                accounts_receivable.accountsReceivableType,
                                accounts_receivable.clientid,
                                accounts_receivable.inDate,
                                accounts_receivable.amounts,
                                accounts_receivable.checkedAmounts,
                                accounts_receivable.notCheckAmounts,
                                accounts_receivable.correlationId,
                                accounts_receivable.correlationType,
                                accounts_receivable.creater,
                                accounts_receivable.createdAt,
                                accounts_receivable.updater,
                                accounts_receivable.updatedAt
                            FROM
                                accounts_receivable
                            WHERE
                                accounts_receivable.del_uuid = 0
                                AND accounts_receivable.accountsReceivableId = ?`;
        const [res] = await conn.query(sql, [accountsReceivableId]);
        if ((res as IAccountsReceivable[]).length > 0) {
            return (res as IAccountsReceivable[])[0];
        } else {
            return Promise.reject(new Error("查询应收账款错误"));
        }
    }

    public async find(findDto: AccountsReceivableFindDto): Promise<IAccountsReceivableFind[]> {
        const conn = this.mysqldbAls.getConnectionInAls();
        let sql: string = `SELECT
                                accounts_receivable.accountsReceivableId,
                                accounts_receivable.accountsReceivableType,
                                accounts_receivable.clientid,
                                accounts_receivable.inDate,
                                accounts_receivable.amounts,
                                accounts_receivable.checkedAmounts,
                                accounts_receivable.notCheckAmounts,
                                accounts_receivable.correlationId,
                                accounts_receivable.correlationType,
                                accounts_receivable.creater,
                                accounts_receivable.createdAt,
                                accounts_receivable.updater,
                                accounts_receivable.updatedAt,
                                client.clientname,
                                (
                                    CASE
                                    WHEN outbound.outboundcode <> '' THEN
                                        outbound.outboundcode
                                    WHEN account_income.accountInComeCode <> '' THEN
                                        account_income.accountInComeCode
                                    ELSE
                                        '[无]'
                                    END
                                ) AS correlationCode
                            FROM
                                accounts_receivable
                                LEFT JOIN client ON client.clientid = accounts_receivable.clientid
                                LEFT JOIN outbound ON outbound.outboundid = accounts_receivable.correlationId AND accounts_receivable.correlationType = ${CodeType.XS}
                                LEFT JOIN account_income ON accounts_receivable.correlationId = account_income.accountInComeId AND accounts_receivable.correlationType = ${CodeType.accountInCome}
                            WHERE
                                accounts_receivable.del_uuid = 0
                                AND accounts_receivable.notCheckAmounts <> 0`;
        const params = [];

        if (findDto.clientid) {
            sql = sql + ` AND accounts_receivable.clientid = ?`
            params.push(findDto.clientid);
        }

        if (findDto.accountsReceivableId) {
            sql = sql + ` AND accounts_receivable.accountsReceivableId = ?`;
            params.push(findDto.accountsReceivableId);
        }

        if (findDto.accountsReceivableTypeList && findDto.accountsReceivableTypeList.length > 0) {
            findDto.accountsReceivableTypeList = findDto.accountsReceivableTypeList.map((accountsReceivableType)=>{
                if(accountsReceivableType === AccountCategoryType.accountsReceivable1 ||
                    accountsReceivableType === AccountCategoryType.otherReceivables3 ||
                    accountsReceivableType === AccountCategoryType.advancePayment2
                ){
                    return accountsReceivableType
                }
            })

            sql = sql + ` AND accounts_receivable.accountsReceivableType IN (?)`;
            params.push(findDto.accountsReceivableTypeList);
        }

        if (findDto.correlationId && findDto.correlationType) {
            sql = sql + ` AND accounts_receivable.correlationId = ?`;
            sql = sql + ` AND accounts_receivable.correlationType = ?`;
            params.push(findDto.correlationId, findDto.correlationType);
        }

        if (findDto.correlationCode.length>0) {
            sql = sql + ` AND (outbound.outboundcode LIKE ? OR 
                              account_income.accountInComeCode
                              LIKE ?)`;
            params.push(`%${findDto.correlationCode}%`,`%${findDto.correlationCode}%`);
        }

        if(findDto.amounts){
            sql = sql + ` AND accounts_receivable.amounts = ?`;
            params.push(findDto.amounts);
        }

        if(findDto.checkedAmounts){
            sql = sql + ` AND accounts_receivable.checkedAmounts = ?`;
            params.push(findDto.checkedAmounts);
        }

        if(findDto.notCheckAmounts){
            sql = sql + ` AND accounts_receivable.notCheckAmounts = ?`;
            params.push(findDto.notCheckAmounts);
        }

        //按出仓日期范围查询
        if (findDto.startDate.length > 0 && findDto.endDate.length > 0) {
            sql = sql + ` AND DATE(accounts_receivable.inDate) BETWEEN ? AND ?`;
            params.push(findDto.startDate, findDto.endDate);
        }

        //分页查询
        if (findDto.page > 0 && findDto.pagesize > 0) {
            sql = sql + ` LIMIT ?,?`;
            params.push(findDto.page, findDto.pagesize);
        }

        const [res] = await conn.query(sql, params);
        if ((res as IAccountsReceivableFind[]).length > 0) {
            return (res as IAccountsReceivableFind[]);
        } else {
            return [];
        }
    }

    public async create(accounts_receivable: IAccountsReceivable) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO accounts_receivable (
                        accounts_receivable.accountsReceivableId,
                        accounts_receivable.accountsReceivableType,
                        accounts_receivable.clientid,
                        accounts_receivable.inDate,
                        accounts_receivable.amounts,
                        accounts_receivable.checkedAmounts,
                        accounts_receivable.notCheckAmounts,
                        accounts_receivable.correlationId,
                        accounts_receivable.correlationType,
                        accounts_receivable.creater,
                        accounts_receivable.createdAt
                     ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            accounts_receivable.accountsReceivableId,
            accounts_receivable.accountsReceivableType,
            accounts_receivable.clientid,
            accounts_receivable.inDate,
            accounts_receivable.amounts,
            accounts_receivable.checkedAmounts,
            accounts_receivable.notCheckAmounts,
            accounts_receivable.correlationId,
            accounts_receivable.correlationType,
            accounts_receivable.creater,
            accounts_receivable.createdAt
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('新增应收账款失败'));
        }
    }

    public async update(accountsReceivable: IAccountsReceivable) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        accounts_receivable 
                     SET 
                        accounts_receivable.amounts = ?,
                        accounts_receivable.checkedAmounts = ?,
                        accounts_receivable.notCheckAmounts = ?,
                        accounts_receivable.correlationId = ?,
                        accounts_receivable.correlationType = ?,
                        accounts_receivable.updater = ?,
                        accounts_receivable.updatedAt = ?
                     WHERE 
                        accounts_receivable.del_uuid = 0
                        AND accounts_receivable.accountsReceivableId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountsReceivable.amounts,
            accountsReceivable.checkedAmounts,
            accountsReceivable.notCheckAmounts,
            accountsReceivable.correlationId,
            accountsReceivable.correlationType,
            accountsReceivable.updater,
            accountsReceivable.updatedAt,
            accountsReceivable.accountsReceivableId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('更新应收账款失败'));
        }
    }

    public async deleteById(accountsReceivableId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM
                        accounts_receivable
                     WHERE
                        accounts_receivable.del_uuid = 0
                        AND accounts_receivable.accountsReceivableId = ?`
        const [res] = await conn.query<ResultSetHeader>(sql, [
            accountsReceivableId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除应收账款失败'));
        }
    }
}