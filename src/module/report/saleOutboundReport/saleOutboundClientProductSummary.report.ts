import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";

export interface ISaleOutboundClientProductReport {
    clientcode:string;
    clientname:string;
    productid: number;
    productcode: string;
    productname: string;
    unit: string;
    spec: string;
    materials: string;
    spec_d: string;
    materials_d: string;
    remarkmx: string;
    remark: string;
    priceqty: number;
    amt: number;
}

@Injectable()
export class SaleOutboundClientProductSummaryReport {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async find() {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                        client.clientcode,
                        client.clientname,
                        saleOutboundReport.clientid,
                        saleOutboundReport.productid,
                        saleOutboundReport.productcode,
                        saleOutboundReport.productname,
                        saleOutboundReport.unit,
                        saleOutboundReport.spec,
                        saleOutboundReport.materials,
                        saleOutboundReport.spec_d,
                        saleOutboundReport.materials_d,
                        saleOutboundReport.remarkmx,
                        saleOutboundReport.remark,
                        SUM(
                            saleOutboundReport.priceqty
                        ) AS priceqty,
                        SUM(saleOutboundReport.amt) AS amt
                    FROM
                        (
                            SELECT
                                outbound_mx.outboundid,
                                outbound_mx.productid,
                                outbound_mx.spec_d,
                                outbound_mx.materials_d,
                                outbound_mx.remarkmx,
                                outbound_mx.remark,
                                outbound_mx.productNameClientRemark,
                                outbound_mx.specClientRemark,
                                outbound_mx.materialsClientRemark,
                                outbound_mx.outqty,
                                outbound_mx.bzqty,
                                outbound_mx.priceqty,
                                outbound_mx.price,
                                outbound_mx.bzprice,
                                outbound_mx.netprice,
                                outbound_mx.floatprice1,
                                outbound_mx.floatprice2,
                                outbound_mx.floatprice3,
                                outbound_mx.agio,
                                outbound_mx.agio1,
                                outbound_mx.agio2,
                                round(
                                    outbound_mx.netprice * outbound_mx.priceqty,
                                    2
                                ) AS amt,
                                outbound_mx.exchangeRate,
                                outbound_mx.rate,
                                outbound_mx.rateAmount,
                                outbound_mx.pricetype,
                                outbound_mx.warehouseid,
                                outbound_mx.ratePrice,
                                outbound_mx.beforeAmount,
                                outbound_mx.amount,
                                outbound_mx.taxInclusiveAmount,
                                product.productcode,
                                product.productname,
                                product.materials,
                                product.spec,
                                product.unit,
                                outbound.clientid
                            FROM
                                outbound_mx
                            INNER JOIN product ON outbound_mx.productid = product.productid
                            INNER JOIN outbound ON outbound.outboundid = outbound_mx.outboundid
                            
                            WHERE
                                outbound.del_uuid = 0
                            AND outbound.outboundtype = 8
                        ) AS saleOutboundReport
                    LEFT JOIN client ON client.clientid = saleOutboundReport.clientid
                    GROUP BY
                        saleOutboundReport.clientid,
                        saleOutboundReport.productid,
                        saleOutboundReport.spec_d,
                        saleOutboundReport.materials_d,
                        saleOutboundReport.remarkmx,
                        saleOutboundReport.remark
                    ORDER BY
                        saleOutboundReport.clientid ASC`;
        const [res] = await conn.query(sql);
        return res as ISaleOutboundClientProductReport[]
    }
}