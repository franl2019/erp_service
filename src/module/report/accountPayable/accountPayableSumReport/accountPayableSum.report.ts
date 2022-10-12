import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../../mysqldb/mysqldbAls";
import {AccountPayableSumReportFindDto} from "./dto/accountPayableSumReportFind.dto";
import {IAccountPayableSumReport} from "./accountPayableSumReport";
import * as moment from "moment";

@Injectable()
export class AccountPayableSumReport {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(findDto:AccountPayableSumReportFindDto){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const openDay = moment(findDto.startDate).subtract(1, 'days').format('YYYY-MM-DD')
        const sql = `
                    SELECT buy.buycode,
                           buy.buyname,
                           ROUND(IFNULL(uv_accounts_payable_sum_report.openQty,0),2)          as openQty,
                           ROUND(IFNULL(uv_accounts_payable_sum_report.accountPayable,0),2)      as accountPayable,
                           ROUND(IFNULL(uv_accounts_payable_sum_report.actuallyPayment,0),2) as actuallyPayment,
                           ROUND(IFNULL(uv_accounts_payable_sum_report.endingBalance,0),2)    as endingBalance
                    FROM 
                        buy
                        LEFT JOIN (
                                SELECT 
                                    accounts_payable.buyid as uv_row_buyid,
                                   (
                                    SELECT 
                                        SUM(
                                           - accounts_payable_mx.advancesPayment 
                                           + accounts_payable_mx.accountPayable
                                           - accounts_payable_mx.actuallyPayment
                                           )
                                    FROM 
                                        accounts_payable_mx
                                        INNER JOIN accounts_payable ON accounts_payable_mx.accountsPayableId = accounts_payable.accountsPayableId
                                    WHERE 
                                        accounts_payable.buyid = uv_row_buyid
                                      AND DATE( accounts_payable_mx.indate ) BETWEEN '0000-00-00' AND ${conn.escape(openDay)}
                                      )                                                                                     as openQty,
                                   SUM( accounts_payable_mx.accountPayable )                                                as accountPayable,
                                   SUM( accounts_payable_mx.advancesPayment + accounts_payable_mx.actuallyPayment ) as actuallyPayment,
                                   SUM(  - accounts_payable_mx.advancesPayment 
                                         + accounts_payable_mx.accountPayable 
                                         - accounts_payable_mx.actuallyPayment
                                       )                                                                                    as endingBalance,
                                   accounts_payable.buyid
                                FROM 
                                   accounts_payable_mx
                                   INNER JOIN accounts_payable ON accounts_payable_mx.accountsPayableId = accounts_payable.accountsPayableId
                                WHERE 
                                   1 = 1
                                   ${findDto.buyid?` AND accounts_payable.buyid = ${conn.escape(findDto.buyid)}`:''}
                                   AND DATE(accounts_payable_mx.indate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}
                                GROUP BY 
                                   accounts_payable.buyid
                        ) as uv_accounts_payable_sum_report ON uv_accounts_payable_sum_report.buyid = buy.buyid
                        WHERE
                            1 = 1
                            ${findDto.buyid?` AND buy.buyid = ${conn.escape(findDto.buyid)}`:''}
        `;

        const [res] = await conn.query(sql);
        return res as IAccountPayableSumReport[]
    }
}