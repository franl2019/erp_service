import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../../mysqldb/mysqldbAls";
import {AccountsReceivableSumReportFindDto} from "./dto/accountsReceivableSumReportFind.dto";
import {IAccountsReceivableSumReport} from "./accountsReceivableSumReport";
import * as moment from "moment";

@Injectable()
export class AccountsReceivableSumReport {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(findDto:AccountsReceivableSumReportFindDto){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const openDay = moment(findDto.startDate).subtract(1, 'days').format('YYYY-MM-DD')
        const sql = `   SELECT client.clientcode,
                               client.clientname,
                               ROUND(IFNULL(uv_accounts_receivable_sum_report.openQty,0),2)          as openQty,
                               ROUND(IFNULL(uv_accounts_receivable_sum_report.receivables,0),2)      as receivables,
                               ROUND(IFNULL(uv_accounts_receivable_sum_report.actuallyReceived,0),2) as actuallyReceived,
                               ROUND(IFNULL(uv_accounts_receivable_sum_report.endingBalance,0),2)    as endingBalance
                        FROM 
                            client
                            LEFT JOIN (
                                    SELECT 
                                        accounts_receivable.clientid as uv_clientid,
                                       (
                                        SELECT 
                                            SUM(
                                               - accounts_receivable_mx.advancesReceived 
                                               + accounts_receivable_mx.receivables
                                               - accounts_receivable_mx.actuallyReceived
                                               )
                                        FROM 
                                            accounts_receivable_mx
                                            INNER JOIN accounts_receivable ON accounts_receivable_mx.accountsReceivableId = accounts_receivable.accountsReceivableId
                                        WHERE 
                                            accounts_receivable.clientid = uv_clientid
                                          AND DATE( accounts_receivable_mx.indate ) BETWEEN '0000-00-00' AND ${conn.escape(openDay)}
                                          )                                                                                     as openQty,
                                       SUM( accounts_receivable_mx.receivables )                                                as receivables,
                                       SUM( accounts_receivable_mx.advancesReceived + accounts_receivable_mx.actuallyReceived ) as actuallyReceived,
                                       SUM(  - accounts_receivable_mx.advancesReceived 
                                             + accounts_receivable_mx.receivables 
                                             - accounts_receivable_mx.actuallyReceived
                                           )                                                                                    as endingBalance,
                                       accounts_receivable.clientid
                                    FROM 
                                       accounts_receivable_mx
                                       INNER JOIN accounts_receivable ON accounts_receivable_mx.accountsReceivableId = accounts_receivable.accountsReceivableId
                                    WHERE 
                                       1 = 1
                                       ${findDto.clientid?` AND accounts_receivable.clientid = ${conn.escape(findDto.clientid)}`:''}
                                       AND DATE(accounts_receivable_mx.indate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}
                                    GROUP BY 
                                       accounts_receivable.clientid
                            ) as uv_accounts_receivable_sum_report ON uv_accounts_receivable_sum_report.clientid = client.clientid
                            WHERE
                                1 = 1
                                ${findDto.clientid?` AND client.clientid = ${conn.escape(findDto.clientid)}`:''}
        `;


        console.log(sql)
        const [res] = await conn.query(sql);
        return res as IAccountsReceivableSumReport[];
    }

}