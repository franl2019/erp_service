import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountInComeAmountMx} from "./accountInComeAmountMx";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class AccountInComeAmountMxEntity {

    constructor(
        private readonly mysqldbAls:MysqldbAls,
    ) {
    }

    public async findById(accountInComeAmountMxId:number):Promise<IAccountInComeAmountMx>{
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        account_income_amount_mx.accountInComeAmountMxId,
                        account_income_amount_mx.accountInComeAmountId,
                        account_income_amount_mx.printId,
                        account_income_amount_mx.settlementMethod,
                        account_income_amount_mx.accountId,
                        account_income_amount_mx.amount,
                        account_income_amount_mx.currencyid,
                        account_income_amount_mx.exchangeRate,
                        account_income_amount_mx.accountsReceivable,
                        account_income_amount_mx.paymentAccount,
                        account_income_amount_mx.payer,
                        account_income_amount_mx.reMack1,
                        account_income_amount_mx.reMack2,
                        account_income_amount_mx.reMack3
                     FROM
                        account_income_amount_mx
                     WHERE
                        account_income_amount_mx.accountInComeAmountMxId = ?`;
        const [res] = await conn.query(sql,[accountInComeAmountMxId]);
        if((res as IAccountInComeAmountMx[]).length>0){
            return (res as IAccountInComeAmountMx[])[0];
        }else{
            return Promise.reject(new Error('查询收款单收款明细单个失败'));
        }
    }

    public async find(accountInComeAmountId:number):Promise<IAccountInComeAmountMx[]>{
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        account_income_amount_mx.accountInComeAmountMxId,
                        account_income_amount_mx.accountInComeAmountId,
                        account_income_amount_mx.printId,
                        account_income_amount_mx.settlementMethod,
                        account_income_amount_mx.accountId,
                        account_income_amount_mx.amount,
                        account_income_amount_mx.currencyid,
                        account_income_amount_mx.exchangeRate,
                        account_income_amount_mx.accountsReceivable,
                        account_income_amount_mx.paymentAccount,
                        account_income_amount_mx.payer,
                        account_income_amount_mx.reMack1,
                        account_income_amount_mx.reMack2,
                        account_income_amount_mx.reMack3
                     FROM
                        account_income_amount_mx
                     WHERE
                        account_income_amount_mx.accountInComeAmountId = ?`;
        const [res] = await conn.query(sql,[accountInComeAmountId]);
        if((res as IAccountInComeAmountMx[]).length>0){
            return (res as IAccountInComeAmountMx[]);
        }else{
            return Promise.reject(new Error('查询收款单收款明细失败'));
        }
    }

    public async create(account_income_amount_mx:IAccountInComeAmountMx){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO account_income_amount_mx (
                        account_income_amount_mx.accountInComeAmountId,
                        account_income_amount_mx.printId,
                        account_income_amount_mx.settlementMethod,
                        account_income_amount_mx.accountId,
                        account_income_amount_mx.amount,
                        account_income_amount_mx.currencyid,
                        account_income_amount_mx.exchangeRate,
                        account_income_amount_mx.accountsReceivable,
                        account_income_amount_mx.paymentAccount,
                        account_income_amount_mx.payer,
                        account_income_amount_mx.reMack1,
                        account_income_amount_mx.reMack2,
                        account_income_amount_mx.reMack3
                    ) VALUES ?`
        const [res] = await conn.query<ResultSetHeader>(sql,[[[
            account_income_amount_mx.accountInComeAmountId,
            account_income_amount_mx.printId,
            account_income_amount_mx.settlementMethod,
            account_income_amount_mx.accountId,
            account_income_amount_mx.amount,
            account_income_amount_mx.currencyid,
            account_income_amount_mx.exchangeRate,
            account_income_amount_mx.accountsReceivable,
            account_income_amount_mx.paymentAccount,
            account_income_amount_mx.payer,
            account_income_amount_mx.reMack1,
            account_income_amount_mx.reMack2,
            account_income_amount_mx.reMack3
        ]]]);
        if(res.affectedRows>0){
            return res;
        }else{
            return Promise.reject(new Error(('新增收款单收款明细失败')));
        }
    }

    public async deleteById(accountInComeAmountId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql =`DELETE FROM
                        account_income_amount_mx 
                    WHERE 
                        account_income_amount_mx.accountInComeAmountId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[accountInComeAmountId]);
        if(res.affectedRows>0){
            return res;
        }else{
            return Promise.reject(new Error(('删除收款单收款明细失败')));
        }
    }
}