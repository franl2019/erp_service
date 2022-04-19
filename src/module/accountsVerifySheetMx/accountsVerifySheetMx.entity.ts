import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IAccountsVerifySheetMx} from "./accountsVerifySheetMx";
import {Injectable} from "@nestjs/common";
import {ResultSetHeader} from "mysql2/promise";
import {AccountsVerifySheetMxFindDto} from "./dto/accountsVerifySheetMxFind.dto";
import {CodeType} from "../autoCode/codeType";
import {AccountCategoryType} from "./accountCategoryType";

@Injectable()
export class AccountsVerifySheetMxEntity {

    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async find(accountsVerifySheetMxFindDto: AccountsVerifySheetMxFindDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = ` SELECT
                        accounts_verify_sheet_mx.accountsVerifySheetMxId,
                        accounts_verify_sheet_mx.accountsVerifySheetId,
                        accounts_verify_sheet_mx.amounts,
                        accounts_verify_sheet_mx.amountsVerified,
                        accounts_verify_sheet_mx.amountsNotVerify,
                        accounts_verify_sheet_mx.amountsMantissa,
                        accounts_verify_sheet_mx.amountsThisVerify,
                        accounts_verify_sheet_mx.correlationId,
                        accounts_verify_sheet_mx.correlationType,
                        accounts_verify_sheet_mx.printId,
                        (
                            CASE
                            WHEN inbound.inboundcode <> '' THEN
                                inbound.inboundcode
                            WHEN outbound.outboundcode <> '' THEN
                                outbound.outboundcode
                            WHEN account_income.accountInComeCode <> '' THEN
                                account_income.accountInComeCode
                            WHEN account_expenditure.accountExpenditureCode <> '' THEN
                                account_expenditure.accountExpenditureCode
                            ELSE
                                '[无]'
                            END
                        ) AS correlationCode
                     FROM
                        accounts_verify_sheet_mx
                        LEFT JOIN accounts_payable ON accounts_verify_sheet_mx.correlationId = accounts_payable.accountsPayableId
                        AND accounts_verify_sheet_mx.correlationType IN (${AccountCategoryType.accountsPayable4}, ${AccountCategoryType.prepayments5}, ${AccountCategoryType.otherPayable6})
                        LEFT JOIN accounts_receivable ON accounts_verify_sheet_mx.correlationId = accounts_receivable.accountsReceivableId
                        AND accounts_verify_sheet_mx.correlationType IN (${AccountCategoryType.accountsReceivable1}, ${AccountCategoryType.advancePayment2}, ${AccountCategoryType.otherReceivables3})
                        LEFT JOIN inbound ON inbound.inboundid = accounts_payable.correlationId
                        AND accounts_payable.correlationType = ${CodeType.buyInbound}
                        LEFT JOIN outbound ON outbound.outboundid = accounts_receivable.correlationId
                        AND accounts_receivable.correlationType = ${CodeType.XS}
                        LEFT JOIN account_expenditure ON account_expenditure.accountExpenditureId = accounts_payable.correlationId
                        AND accounts_payable.correlationType = ${CodeType.accountExpenditure}
                        LEFT JOIN account_income ON account_income.accountInComeId = accounts_receivable.correlationId
                        AND accounts_receivable.correlationType = ${CodeType.accountInCome}
                     WHERE
                        accounts_verify_sheet_mx.accountsVerifySheetId = ?`;
        const [res] = await conn.query(sql, [accountsVerifySheetMxFindDto.accountsVerifySheetId]);
        if ((res as IAccountsVerifySheetMx[]).length) {
            return (res as IAccountsVerifySheetMx[])
        } else {
            return Promise.reject(new Error("查询核销单明细失败"));
        }
    }

    public async create(accountsVerifySheetMxList: IAccountsVerifySheetMx[]) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO accounts_verify_sheet_mx (
                        accounts_verify_sheet_mx.accountsVerifySheetMxId,
                        accounts_verify_sheet_mx.accountsVerifySheetId,
                        accounts_verify_sheet_mx.amounts,
                        accounts_verify_sheet_mx.amountsVerified,
                        accounts_verify_sheet_mx.amountsNotVerify,
                        accounts_verify_sheet_mx.amountsMantissa,
                        accounts_verify_sheet_mx.amountsThisVerify,
                        accounts_verify_sheet_mx.correlationId,
                        accounts_verify_sheet_mx.correlationType,
                        accounts_verify_sheet_mx.printId
                     ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [accountsVerifySheetMxList.map(accounts_verify_sheet_mx => [
            accounts_verify_sheet_mx.accountsVerifySheetMxId,
            accounts_verify_sheet_mx.accountsVerifySheetId,
            accounts_verify_sheet_mx.amounts,
            accounts_verify_sheet_mx.amountsVerified,
            accounts_verify_sheet_mx.amountsNotVerify,
            accounts_verify_sheet_mx.amountsMantissa,
            accounts_verify_sheet_mx.amountsThisVerify,
            accounts_verify_sheet_mx.correlationId,
            accounts_verify_sheet_mx.correlationType,
            accounts_verify_sheet_mx.printId
        ])]);

        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('新增核销单明细失败'));
        }
    }

    public async delete_data(accountsVerifySheetId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM 
                        accounts_verify_sheet_mx
                     WHERE 
                        accounts_verify_sheet_mx.accountsVerifySheetId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [accountsVerifySheetId]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error('删除核销单明细失败'));
        }
    }
}