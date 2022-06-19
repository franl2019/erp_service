import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {CodeType} from "../../autoCode/codeType";
import {IProduct} from "../../product/product";

export interface IBuyInboundSummaryReport extends IProduct{
    amt:number
}

@Injectable()
export class BuyInboundProductSummaryReport {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(){
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = ` SELECT
                        product.productcode,
                        product.productname,
                        product.materials,
                        product.spec,
                        product.unit,
                        buyInboundSummaryReport.remarkmx,
                        buyInboundSummaryReport.remark,
                        SUM(
                            buyInboundSummaryReport.priceqty
                        ) AS priceqty,
                        SUM(
                            buyInboundSummaryReport.amt
                        ) AS amt
                    FROM
                        (
                            SELECT
                                inbound_mx.inboundid,
                                inbound_mx.printid,
                                inbound_mx.clientid,
                                inbound_mx.productid,
                                inbound_mx.spec,
                                inbound_mx.materials,
                                inbound_mx.spec_d,
                                inbound_mx.materials_d,
                                inbound_mx.remarkmx,
                                inbound_mx.remark,
                                inbound_mx.inqty,
                                inbound_mx.bzqty,
                                inbound_mx.price,
                                inbound_mx.bzprice,
                                inbound_mx.priceqty,
                                inbound_mx.netprice,
                                ROUND(
                                    inbound_mx.priceqty * inbound_mx.netprice,
                                    2
                                ) AS amt,
                                inbound_mx.agio,
                                inbound_mx.agio1,
                                inbound_mx.agio2,
                                inbound_mx.pricetype
                            FROM
                                inbound_mx
                            INNER JOIN inbound ON inbound.inboundid = inbound_mx.inboundid
                            WHERE
                                inbound.del_uuid = 0
                            AND inbound.inboundtype = ${CodeType.buyInbound}
                        ) AS buyInboundSummaryReport
                    INNER JOIN product ON product.productid = buyInboundSummaryReport.productid
                    WHERE
                        product.del_uuid = 0
                    GROUP BY
                        product.productcode,
                        product.productname,
                        product.materials,
                        product.spec,
                        product.unit,
                        buyInboundSummaryReport.remarkmx,
                        buyInboundSummaryReport.remark`;
        const [res] = await conn.query(sql);
        return res as IBuyInboundSummaryReport[];
    }
}