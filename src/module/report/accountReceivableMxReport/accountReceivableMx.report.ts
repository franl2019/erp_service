import {CodeType} from "../../autoCode/codeType";
import {AccountReceivableMxReportFindDto} from "./dto/accountReceivableMxReportFind.dto";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {Injectable} from "@nestjs/common";

@Injectable()
export class AccountReceivableMxReport {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(findDto:AccountReceivableMxReportFindDto){
        const conn = this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                        accounts_receivable_mx.accountReceivableMxId,
                        accounts_receivable_mx.accountsReceivableId,
                        accounts_receivable_mx.inDate,
                        accounts_receivable_mx.advancesReceived,
                        accounts_receivable_mx.receivables,
                        accounts_receivable_mx.actuallyReceived,
                        accounts_receivable_mx.abstract,
                        accounts_receivable_mx.reMark,
                        accounts_receivable_mx.creater,
                        accounts_receivable_mx.createdAt,
                        accounts_receivable_mx.updater,
                        accounts_receivable_mx.updatedAt,
                        accounts_receivable.correlationId,
                        accounts_receivable.correlationType,
                        accounts_receivable.clientid,
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
                        accounts_receivable_mx
                        INNER JOIN accounts_receivable ON accounts_receivable_mx.accountsReceivableId = accounts_receivable.accountsReceivableId
                        LEFT JOIN client ON client.clientid = accounts_receivable.clientid
                        LEFT JOIN outbound ON outbound.outboundid = accounts_receivable.correlationId
                        AND accounts_receivable.correlationType = ${CodeType.XS}
                        LEFT JOIN account_income ON accounts_receivable.correlationId = account_income.accountInComeId
                        AND accounts_receivable.correlationType = ${CodeType.accountInCome}
                    `;

        const params = [];

        if(findDto.clientid){
            sql = sql + ` WHERE
                            accounts_receivable.clientid = ? `;
            params.push(findDto.clientid);
        }

        sql = sql + ` ORDER BY
                        accounts_receivable.clientid ASC,
                        accounts_receivable_mx.inDate ASC`;

        const [res] = await conn.query(sql,params);
        return res;
    }
}