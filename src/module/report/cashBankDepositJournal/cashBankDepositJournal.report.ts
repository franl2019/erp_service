import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {cashBankDepositJournalReportFindDto} from "./dto/cashBankDepositJournalReportFindDto";
import {CodeType} from "../../autoCode/codeType";

@Injectable()
export class CashBankDepositJournalReport {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async find(findDto: cashBankDepositJournalReportFindDto) {
        const conn = this.mysqldbAls.getConnectionInAls();
        let sql = `  SELECT
                        account.accountCode,
                        account.accountName,
                        account_record.indate,
                        account_record.accountRecordId,
                        account_record.accountId,
                        account_record.openQty,
                        account_record.debitQty,
                        account_record.creditQty,
                        account_record.balanceQty,
                        account_record.reMark,
                        account_record.relatedNumber,
                        account_record.creater,
                        account_record.createdAt,
                        account_record.correlationId,
                        account_record.correlationType,
                        (
                            CASE
                            WHEN account_income.accountInComeCode <> '' THEN
                                account_income.accountInComeCode
                            WHEN account_expenditure.accountExpenditureCode <> '' THEN
                                account_expenditure.accountExpenditureCode
                            ELSE
                                '[无]'
                            END
                ) AS correlationCode
                    FROM
                        account_record
                        INNER JOIN account ON account.accountId = account_record.accountId
                        LEFT JOIN account_expenditure ON account_expenditure.accountExpenditureId = account_record.correlationId
                        AND account_record.correlationType = ${CodeType.accountExpenditure}
                        LEFT JOIN account_income ON account_income.accountInComeId = account_record.correlationId
                        AND account_record.correlationType = ${CodeType.accountInCome}
                    `;

        const params = []

        if(findDto.accountId){
            sql = sql + ` WHERE account_record.accountId = ? `
            params.push(findDto.accountId);
        }

        //排序
        sql = sql + ` ORDER BY
                        account_record.accountId ASC,
                        account_record.indate ASC`;

        const [res] = await conn.query(sql,params);
        return res;
    }
}