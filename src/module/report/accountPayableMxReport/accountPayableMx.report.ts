import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {CodeType} from "../../autoCode/codeType";
import {AccountPayableMxReportFindDto} from "./dto/AccountPayableMxReportFind.dto";
import {Injectable} from "@nestjs/common";

@Injectable()
export class AccountPayableMxReport {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(findDto:AccountPayableMxReportFindDto){
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                    accounts_payable_mx.accountsPayableMxId,
                    accounts_payable_mx.accountsPayableId,
                    accounts_payable_mx.inDate,
                    accounts_payable_mx.advancesPayment,
                    accounts_payable_mx.accountPayable,
                    accounts_payable_mx.actuallyPayment,
                    accounts_payable_mx.abstract,
                    accounts_payable_mx.reMark,
                    accounts_payable_mx.creater,
                    accounts_payable_mx.createdAt,
                    accounts_payable_mx.updater,
                    accounts_payable_mx.updatedAt,
                    buy.buyname,
                    accounts_payable.correlationId,
                    accounts_payable.correlationType,
                    (
                        CASE
                        WHEN inbound.inboundcode <> '' THEN
                            inbound.inboundcode
                        WHEN account_expenditure.accountExpenditureCode <> '' THEN
                            account_expenditure.accountExpenditureCode
                        ELSE
                            '[无]'
                        END
                    ) AS correlationCode
                FROM
                    accounts_payable_mx
                    INNER JOIN accounts_payable ON accounts_payable_mx.accountsPayableId = accounts_payable.accountsPayableId
                    INNER JOIN buy ON buy.buyid = accounts_payable.buyid
                    LEFT JOIN inbound ON inbound.inboundid = accounts_payable.correlationId
                    AND accounts_payable.correlationType = ${CodeType.buyInbound}
                    LEFT JOIN account_expenditure ON accounts_payable.correlationId = account_expenditure.accountExpenditureId
                    AND accounts_payable.correlationType = ${CodeType.accountExpenditure}
                `

        const params = [];

        if(findDto.buyid){
            sql = sql + ` WHERE
                            buy.buyid = ? `;
            params.push(findDto.buyid);
        }

        sql = sql + ` ORDER BY
                    accounts_payable.buyid ASC,
                    accounts_payable.inDate ASC `;

        const [res] = await conn.query(sql,params);
        return res;
    }
}