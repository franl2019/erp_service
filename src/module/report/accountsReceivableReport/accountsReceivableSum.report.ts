import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
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
                               uv_accounts_receivable_sum_report.openQty,
                               uv_accounts_receivable_sum_report.receivables,
                               uv_accounts_receivable_sum_report.actuallyReceived,
                               uv_accounts_receivable_sum_report.endingBalance
                        FROM 
                            client
                            LEFT JOIN (
                                    SELECT 
                                        accounts_receivable.clientid AS uv_clientid,
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
                                          )                                                                                     AS openQty,
                                          
                                       SUM( accounts_receivable_mx.receivables )                                                AS receivables,
                                       
                                       SUM( accounts_receivable_mx.advancesReceived + accounts_receivable_mx.actuallyReceived ) AS actuallyReceived,
                                       SUM(  - accounts_receivable_mx.advancesReceived 
                                             + accounts_receivable_mx.receivables 
                                             - accounts_receivable_mx.actuallyReceived
                                           )                                                                                    AS endingBalance,
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
                            ) AS uv_accounts_receivable_sum_report ON uv_accounts_receivable_sum_report.clientid = client.clientid
        `;


        console.log(sql)
        const [res] = await conn.query(sql);
        return res as IAccountsReceivableSumReport[];
    }

}