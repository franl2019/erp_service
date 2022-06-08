import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {cashBankDepositJournalReportFindDto} from "./dto/cashBankDepositJournalReportFindDto";
import {CodeType} from "../../autoCode/codeType";
import * as moment from "moment";

@Injectable()
export class CashBankDepositJournalReport {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async find(findDto: cashBankDepositJournalReportFindDto) {
        const conn = this.mysqldbAls.getConnectionInAls();
        const openDay = moment(findDto.startDate).subtract(1, 'days').format('YYYY-MM-DD')

        let sql = ` SELECT
                        bankReport.accountRecordId,
                        bankReport.accountId,
                        bankReport.indate,
                        bankReport.openQty,
                        bankReport.debitQty,
                        bankReport.creditQty,
                        bankReport.balanceQty,
                        bankReport.reMark,
                        bankReport.relatedNumber,
                        bankReport.creater,
                        bankReport.createdAt,
                        bankReport.correlationId,
                        bankReport.correlationType,
                        IF(
                            bankReport.correlationType = ${CodeType.accountInCome},
                            account_income.accountInComeCode,
                            account_expenditure.accountExpenditureCode
                                   ) as correlationCode,
                        IF(
                            bankReport.correlationType = ${CodeType.accountInCome},
                            client.clientname,
                            buy.buyname
                           ) as correlationPeople,
                        bankReport.printid,
                        account.accountCode,
                        account.accountName
                    FROM
                        (
                            SELECT
                                0 AS accountRecordId,
                                account_record.accountId,
                                '' AS indate,
                                0 AS openQty,
                                ROUND(
                                    SUM(account_record.debitQty),
                                    4
                                ) AS debitQty,
                                ROUND(
                                    SUM(account_record.creditQty),
                                    4
                                ) AS creditQty,
                                ROUND(
                                    SUM(
                                        account_record.debitQty - account_record.creditQty
                                    ),
                                    2
                                ) AS balanceQty,
                                '' AS reMark,
                                '' AS relatedNumber,
                                '' AS creater,
                                0 AS createdAt,
                                0 AS correlationId,
                                -1 AS correlationType,
                                0 AS printid
                            FROM
                                account_record
                            WHERE
                                1 = 1
                                ${findDto.accountId?` AND account_record.accountId = ${conn.escape(findDto.accountId)}`:''}
                                AND DATE(account_record.indate) BETWEEN '0000-00-00' AND ${conn.escape(openDay)}
                            GROUP BY
                                account_record.accountId
                               
                            UNION ALL
                            
                            SELECT
                                account_record.accountRecordId,
                                account_record.accountId,
                                account_record.indate,
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
                                1 AS printid
                            FROM
                                account_record
                            WHERE
                                1 = 1
                                ${findDto.accountId?` AND account_record.accountId = ${conn.escape(findDto.accountId)}`:''}
                                AND DATE(account_record.indate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}
                         
                                    
                            UNION ALL
                            
                            SELECT
                                0 AS accountRecordId,
                                account_record.accountId,
                                '' AS indate,
                                0 AS openQty,
                                ROUND(
                                    SUM(account_record.debitQty),
                                    4
                                ) AS debitQty,
                                ROUND(
                                    SUM(account_record.creditQty),
                                    4
                                ) AS creditQty,
                                SUM(
                                    account_record.debitQty - account_record.creditQty
                                ) AS balanceQty,
                                '' AS reMark,
                                '' AS relatedNumber,
                                '' AS creater,
                                0 AS createdAt,
                                0 AS correlationId,
                                -2 AS correlationType,
                                3 AS printid
                            FROM
                                account_record
                            WHERE
                                1 = 1
                                ${findDto.accountId?` AND account_record.accountId = ${conn.escape(findDto.accountId)}`:''}
                                AND DATE(account_record.indate) BETWEEN '0000-00-00'
                            AND ${conn.escape(findDto.endDate)}
                            GROUP BY
                                account_record.accountId
                                
                        ) AS bankReport
                        
                    LEFT JOIN account ON bankReport.accountId = account.accountId
                    
                    LEFT JOIN account_expenditure ON account_expenditure.accountExpenditureId = bankReport.correlationId 
                                AND bankReport.correlationType = ${CodeType.accountExpenditure}
                                
                    LEFT JOIN account_income on account_income.accountInComeId = bankReport.correlationId 
                                AND bankReport.correlationType = ${CodeType.accountInCome}
                                
                    LEFT JOIN buy ON account_expenditure.buyid = buy.buyid
                    
                    LEFT JOIN client ON account_income.clientid = client.clientid

                    ORDER BY
                        bankReport.accountId ASC,
                        bankReport.printid ASC,
                        bankReport.indate ASC
        `;

        console.log(sql)

        const [res] = await conn.query(sql);
        return res;
    }
}