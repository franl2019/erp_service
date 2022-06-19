import {Injectable} from "@nestjs/common";
import { CodeType } from "src/module/autoCode/codeType";
import {MysqldbAls} from "../../../mysqldb/mysqldbAls";
import {IAccountPayableMxReport} from "./accountPayableMxReport";
import {AccountPayableMxReportFindDto} from "./dto/accountPayableMxReportFind.dto";
import * as moment from "moment";

@Injectable()
export class AccountPayableMxReport {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(findDto:AccountPayableMxReportFindDto){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const openDay = moment(findDto.startDate).subtract(1, 'days').format('YYYY-MM-DD');

        const sql = `
                    SELECT
                           accounts_payable_mx_report.correlationId,
                           accounts_payable_mx_report.correlationType,
                           CONCAT_WS(
                                   '',
                                   account_income.accountInComeCode,
                                   account_expenditure.accountExpenditureCode,
                                   accounts_verify_sheet.accountsVerifySheetCode,
                                   outbound.outboundcode,
                                   inbound.inboundcode
                               ) AS correlationCode,
                           accounts_payable_mx_report.advancesPayment,
                           accounts_payable_mx_report.accountPayable,
                           accounts_payable_mx_report.actuallyPayment,
                           IF(accounts_payable_mx_report.printid = 3,
                           accounts_payable_mx_report.endingBalance,
                           SUM(
                              0 - accounts_payable_mx_report.advancesPayment + accounts_payable_mx_report.accountPayable -
                               accounts_payable_mx_report.actuallyPayment
                            ) over (
                                 PARTITION BY accounts_payable_mx_report.buyid
                                 ORDER BY
                                     accounts_payable_mx_report.buyid,
                                     accounts_payable_mx_report.printid,
                                     accounts_payable_mx_report.inDate,
                                     accounts_payable_mx_report.accountsPayableMxId
                            )) as endingBalance,
                           accounts_payable_mx_report.abstract,
                           accounts_payable_mx_report.reMark,
                           accounts_payable_mx_report.inDate,
                           accounts_payable_mx_report.buyid,
                           accounts_payable_mx_report.printid,
                           accounts_payable_mx_report.accountsPayableMxId,
                           buy.buycode,
                           buy.buyname,
                           buy.ymrep
                           
                    FROM (                    
                          SELECT
                                '' as correlationId,
                                - 1 as correlationType,
                                ROUND(IFNULL(uv_beginning_balance.advancesPayment,0),2) as advancesPayment,
                                ROUND(IFNULL(uv_beginning_balance.accountPayable,0),2) as accountPayable,
                                ROUND(IFNULL(uv_beginning_balance.actuallyPayment,0),2) as actuallyPayment,
                                ROUND(IFNULL(uv_beginning_balance.endingBalance,0),2) as endingBalance,
                                '' as abstract,
                                '' as reMark,
                                '' as inDate,
                                buy.buyid,
                                1 as printid,
                                0 as accountsPayableMxId
                          FROM
                              buy
                              LEFT JOIN
                              (SELECT ''   as correlationId,
                                     - 1   as correlationType,
                                     SUM(accounts_payable_mx.advancesPayment)     as advancesPayment,
                                     SUM(accounts_payable_mx.accountPayable)      as accountPayable,
                                     SUM(accounts_payable_mx.actuallyPayment)     as actuallyPayment,
                                     0 as endingBalance,
                                     ''    as abstract,
                                     ''    as reMark,
                                     ''    as inDate,
                                     accounts_payable.buyid,
                                     1     as printid
                              FROM accounts_payable_mx
                                       INNER JOIN accounts_payable
                                                  ON accounts_payable.accountsPayableId = accounts_payable_mx.accountsPayableId
                        
                              WHERE 
                                    1 = 1
                                    ${findDto.buyid?` AND accounts_payable.buyid = ${conn.escape(findDto.buyid)}`:''}
                                    AND DATE( accounts_payable_mx.indate ) BETWEEN '0000-00-00' AND ${conn.escape(openDay)}
                              GROUP BY accounts_payable.buyid
                              ) AS uv_beginning_balance ON uv_beginning_balance.buyid = buy.buyid
                          WHERE
                              1 = 1
                              ${findDto.buyid?` AND buy.buyid = ${conn.escape(findDto.buyid)}`:''}
                              
                              
                          UNION ALL
                          
                          SELECT accounts_payable_mx.correlationId,
                                 accounts_payable_mx.correlationType,
                                 accounts_payable_mx.advancesPayment,
                                 accounts_payable_mx.accountPayable,
                                 accounts_payable_mx.actuallyPayment,
                                 0 AS endingBalance,
                                 accounts_payable_mx.abstract,
                                 accounts_payable_mx.reMark,
                                 accounts_payable_mx.inDate,
                                 accounts_payable.buyid,
                                 2                     AS printid,
                                 accounts_payable_mx.accountsPayableMxId
                          FROM accounts_payable_mx
                                   INNER JOIN accounts_payable
                                              ON accounts_payable_mx.accountsPayableId = accounts_payable.accountsPayableId
                    
                          WHERE 
                                ( accounts_payable_mx.advancesPayment <> 0
                                OR accounts_payable_mx.accountPayable <> 0
                                OR accounts_payable_mx.actuallyPayment <> 0 )
                                ${findDto.buyid?` AND accounts_payable.buyid = ${conn.escape(findDto.buyid)}`:''}
                                AND DATE(accounts_payable_mx.indate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}
                    
                          UNION ALL
                          
                          SELECT
                                '' as correlationId,
                                - 2 as correlationType,
                                ROUND(IFNULL(uv_beginning_balance.advancesPayment,0),2) as advancesPayment,
                                ROUND(IFNULL(uv_beginning_balance.accountPayable,0),2)  as accountPayable,
                                ROUND(IFNULL(uv_beginning_balance.actuallyPayment,0),2) as actuallyPayment,
                                ROUND(IFNULL(uv_beginning_balance.endingBalance,0),2)   as endingBalance,
                                '' AS abstract,
                                '' AS reMark,
                                '' AS inDate,
                                buy.buyid,
                                3 AS printid,
                                0 as accountsPayableMxId
                          FROM
                              buy
                              LEFT JOIN
                              (SELECT ''    AS correlationId,
                                     - 2   AS correlationType,
                        
                                     SUM(accounts_payable_mx.advancesPayment)     as advancesPayment,
                                     SUM(accounts_payable_mx.accountPayable)      as accountPayable,
                                     SUM(accounts_payable_mx.actuallyPayment)     as actuallyPayment,
                                     SUM(
                                          - accounts_payable_mx.advancesPayment + accounts_payable_mx.accountPayable -
                                          accounts_payable_mx.actuallyPayment
                                         ) as endingBalance,
                                     ''    as abstract,
                                     ''    as reMark,
                                     ''    as inDate,
                                     accounts_payable.buyid,
                                     3     as printid
                              FROM accounts_payable_mx
                                       INNER JOIN accounts_payable
                                                  ON accounts_payable.accountsPayableId = accounts_payable_mx.accountsPayableId
                        
                              WHERE 
                                   1 = 1
                                   ${findDto.buyid?` AND accounts_payable.buyid = ${conn.escape(findDto.buyid)}`:''}
                                   AND DATE( accounts_payable_mx.indate ) BETWEEN '0000-00-00' AND ${conn.escape(findDto.endDate)}
                              GROUP BY accounts_payable.buyid
                              ) AS uv_beginning_balance ON uv_beginning_balance.buyid = buy.buyid
                          WHERE
                              1 = 1
                              ${findDto.buyid?` AND buy.buyid = ${conn.escape(findDto.buyid)}`:''}
                          
                          ) AS accounts_payable_mx_report
                    LEFT JOIN buy ON accounts_payable_mx_report.buyid = buy.buyid
                    LEFT JOIN account_expenditure
                               ON account_expenditure.accountExpenditureId = accounts_payable_mx_report.correlationId
                                   AND accounts_payable_mx_report.correlationType = ${CodeType.accountExpenditure}
                    LEFT JOIN account_income ON account_income.accountInComeId = accounts_payable_mx_report.correlationId
                        AND accounts_payable_mx_report.correlationType = ${CodeType.accountInCome}
                    LEFT JOIN outbound ON outbound.outboundid = accounts_payable_mx_report.correlationId
                        AND accounts_payable_mx_report.correlationType = ${CodeType.XS}
                    LEFT JOIN inbound ON inbound.inboundid = accounts_payable_mx_report.correlationId
                        AND accounts_payable_mx_report.correlationType = ${CodeType.buyInbound}
                    LEFT JOIN accounts_verify_sheet ON accounts_verify_sheet.accountsVerifySheetId = accounts_payable_mx_report.correlationId
                        AND accounts_payable_mx_report.correlationType =  ${CodeType.HXD}
                    WHERE
                        buy.del_uuid = 0
        `
        console.log(sql)
        const [res] = await conn.query(sql);
        return res as IAccountPayableMxReport[];
    }
}