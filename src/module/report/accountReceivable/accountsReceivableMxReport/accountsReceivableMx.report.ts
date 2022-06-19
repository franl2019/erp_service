import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../../mysqldb/mysqldbAls";
import {AccountsReceivableMxReportFindDto} from "./dto/accountsReceivableMxReportFind.dto";
import {CodeType} from "../../../autoCode/codeType";
import * as moment from "moment";
import {IAccountsReceivableMxReport} from "./accountsReceivableMxReport";

@Injectable()
export class AccountsReceivableMxReport {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(findDto:AccountsReceivableMxReportFindDto){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const openDay = moment(findDto.startDate).subtract(1, 'days').format('YYYY-MM-DD')

        const sql = ` SELECT
                           accounts_receivable_mx_report.correlationId,
                           accounts_receivable_mx_report.correlationType,
                           CONCAT_WS(
                                   '',
                                   account_income.accountInComeCode,
                                   account_expenditure.accountExpenditureCode,
                                   accounts_verify_sheet.accountsVerifySheetCode,
                                   outbound.outboundcode,
                                   inbound.inboundcode
                               ) AS correlationCode,
                           accounts_receivable_mx_report.advancesReceived,
                           accounts_receivable_mx_report.receivables,
                           accounts_receivable_mx_report.actuallyReceived,
                           IF( 
                               accounts_receivable_mx_report.printid = 3,
                               accounts_receivable_mx_report.endingBalance,
                               SUM(
                                  - accounts_receivable_mx_report.advancesReceived 
                                  + accounts_receivable_mx_report.receivables 
                                  - accounts_receivable_mx_report.actuallyReceived
                                 ) over (
                                 PARTITION BY accounts_receivable_mx_report.clientid
                                 ORDER BY
                                     accounts_receivable_mx_report.clientid,
                                     accounts_receivable_mx_report.printid,
                                     accounts_receivable_mx_report.inDate,
                                     accounts_receivable_mx_report.accountReceivableMxId
                                 )
                           ) as endingBalance,
                           accounts_receivable_mx_report.abstract,
                           accounts_receivable_mx_report.reMark,
                           accounts_receivable_mx_report.inDate,
                           accounts_receivable_mx_report.clientid,
                           accounts_receivable_mx_report.printid,
                           accounts_receivable_mx_report.accountReceivableMxId,
                           client.clientcode,
                           client.clientname,
                           client.ymrep
                            
                    FROM (                    
                          SELECT
                                '' as correlationId,
                                - 1 as correlationType,
                                ROUND(IFNULL(uv_beginning_balance.advancesReceived,0),2) AS advancesReceived,
                                ROUND(IFNULL(uv_beginning_balance.receivables,0),2) AS receivables,
                                ROUND(IFNULL(uv_beginning_balance.actuallyReceived,0),2) AS actuallyReceived,
                                ROUND(IFNULL(uv_beginning_balance.endingBalance,0),2) as endingBalance,
                                '' AS abstract,
                                '' AS reMark,
                                '' AS inDate,
                                client.clientid,
                                1 AS printid,
                                uv_beginning_balance.accountReceivableMxId
                          FROM
                              client
                              LEFT JOIN
                              (SELECT ''   as correlationId,
                                     - 1   as correlationType,
                                     SUM(accounts_receivable_mx.advancesReceived) as advancesReceived,
                                     SUM(accounts_receivable_mx.receivables) as receivables,
                                     SUM(accounts_receivable_mx.actuallyReceived) as actuallyReceived,
                                     0     as endingBalance,
                                     ''    as abstract,
                                     ''    as reMark,
                                     ''    as inDate,
                                     accounts_receivable.clientid,
                                     1     as printid,
                                     accounts_receivable_mx.accountReceivableMxId
                              FROM accounts_receivable_mx
                                       INNER JOIN accounts_receivable
                                                  ON accounts_receivable.accountsReceivableId = accounts_receivable_mx.accountsReceivableId
                        
                              WHERE 
                                    1 = 1
                                    ${findDto.clientid?` AND accounts_receivable.clientid = ${conn.escape(findDto.clientid)}`:''}
                                    AND DATE( accounts_receivable_mx.indate ) BETWEEN '0000-00-00' AND ${conn.escape(openDay)}
                              GROUP BY accounts_receivable.clientid
                              ) AS uv_beginning_balance ON uv_beginning_balance.clientid = client.clientid
                          WHERE
                              1 = 1
                              ${findDto.clientid?` AND client.clientid = ${conn.escape(findDto.clientid)}`:''}
                              
                              
                          UNION ALL
                          
                          SELECT accounts_receivable_mx.correlationId,
                                 accounts_receivable_mx.correlationType,
                    
                                 accounts_receivable_mx.advancesReceived,
                                 accounts_receivable_mx.receivables,
                                 accounts_receivable_mx.actuallyReceived,
                                 0 AS endingBalance,
                                 accounts_receivable_mx.abstract,
                                 accounts_receivable_mx.reMark,
                                 accounts_receivable_mx.inDate,
                                 accounts_receivable.clientid,
                                 2                     AS printid,
                                 accounts_receivable_mx.accountReceivableMxId
                          FROM accounts_receivable_mx
                                   INNER JOIN accounts_receivable
                                              ON accounts_receivable_mx.accountsReceivableId = accounts_receivable.accountsReceivableId
                    
                          WHERE 
                                ( accounts_receivable_mx.advancesReceived <> 0
                                OR accounts_receivable_mx.receivables <> 0
                                OR accounts_receivable_mx.actuallyReceived <> 0 )
                                ${findDto.clientid?` AND accounts_receivable.clientid = ${conn.escape(findDto.clientid)}`:''}
                                AND DATE(accounts_receivable_mx.indate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}
                    
                          UNION ALL
                          
                          SELECT
                                '' as correlationId,
                                - 2 as correlationType,
                                0 AS advancesReceived,
                                0 AS receivables,
                                0 AS actuallyReceived,
                                ROUND(IFNULL(uv_beginning_balance.endingBalance,0),2) as endingBalance,
                                '' AS abstract,
                                '' AS reMark,
                                '' AS inDate,
                                client.clientid,
                                3 AS printid,
                                uv_beginning_balance.accountReceivableMxId
                          FROM
                              client
                              LEFT JOIN
                              (SELECT ''    AS correlationId,
                                     - 2   AS correlationType,
                        
                                     SUM(accounts_receivable_mx.advancesReceived)     as advancesReceived,
                                     SUM(accounts_receivable_mx.receivables)          as receivables,
                                     SUM(accounts_receivable_mx.actuallyReceived)     as actuallyReceived,
                                     SUM(
                                                     - accounts_receivable_mx.advancesReceived + accounts_receivable_mx.receivables -
                                                     accounts_receivable_mx.actuallyReceived
                                         ) as endingBalance,
                                     ''    as abstract,
                                     ''    as reMark,
                                     ''    as inDate,
                                     accounts_receivable.clientid,
                                     3     as printid,
                                     accounts_receivable_mx.accountReceivableMxId
                              FROM accounts_receivable_mx
                                       INNER JOIN accounts_receivable
                                                  ON accounts_receivable.accountsReceivableId = accounts_receivable_mx.accountsReceivableId
                        
                              WHERE 
                                   1 = 1
                                   ${findDto.clientid?` AND accounts_receivable.clientid = ${conn.escape(findDto.clientid)}`:''}
                                   AND DATE( accounts_receivable_mx.indate ) BETWEEN '0000-00-00' AND ${conn.escape(findDto.endDate)}
                              GROUP BY accounts_receivable.clientid
                              ) AS uv_beginning_balance ON uv_beginning_balance.clientid = client.clientid
                          WHERE
                              1 = 1
                              ${findDto.clientid?` AND client.clientid = ${conn.escape(findDto.clientid)}`:''}
                          
                          ) AS accounts_receivable_mx_report
                    LEFT JOIN client ON accounts_receivable_mx_report.clientid = client.clientid
                    LEFT JOIN account_expenditure
                               ON account_expenditure.accountExpenditureId = accounts_receivable_mx_report.correlationId
                                   AND accounts_receivable_mx_report.correlationType = ${CodeType.accountExpenditure}
                    LEFT JOIN account_income ON account_income.accountInComeId = accounts_receivable_mx_report.correlationId
                        AND accounts_receivable_mx_report.correlationType = ${CodeType.accountInCome}
                    LEFT JOIN outbound ON outbound.outboundid = accounts_receivable_mx_report.correlationId
                        AND accounts_receivable_mx_report.correlationType = ${CodeType.XS}
                    LEFT JOIN inbound ON inbound.inboundid = accounts_receivable_mx_report.correlationId
                        AND accounts_receivable_mx_report.correlationType = ${CodeType.buyInbound}
                    LEFT JOIN accounts_verify_sheet ON accounts_verify_sheet.accountsVerifySheetId = accounts_receivable_mx_report.correlationId
                        AND accounts_receivable_mx_report.correlationType =  ${CodeType.HXD}
                    WHERE
                        client.del_uuid = 0
                    `;

        console.log(sql)
        const [res] = await conn.query(sql);
        return res as IAccountsReceivableMxReport[]
    }
}