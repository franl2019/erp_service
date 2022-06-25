import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";

export interface ISaleOutboundReport {
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
export class SaleOutboundProductSummaryReport {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async find() {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                        outbound_mx.outboundid,
                        outbound_mx.productid,
                        outbound_mx.spec_d,
                        outbound_mx.materials_d,
                        outbound_mx.remarkmx,
                        outbound_mx.remark,
                        outbound_mx.outqty,
                        outbound_mx.bzqty,
                        SUM(outbound_mx.priceqty) as priceqty,
                        round(
                            SUM(
                                outbound_mx.netprice * outbound_mx.priceqty
                            ),
                            2
                        ) as amt,
                        product.productcode,
                        product.productname,
                        product.materials,
                        product.spec,
                        product.unit
                    FROM
                        outbound_mx
                    LEFT JOIN product ON outbound_mx.productid = product.productid
                    LEFT JOIN outbound ON outbound.outboundid = outbound_mx.outboundid
                    WHERE
                        outbound.del_uuid = 0
                    AND outbound.outboundtype = 8
                    GROUP BY
                        outbound_mx.productid,
                        outbound_mx.spec_d,
                        outbound_mx.materials_d,
                        outbound_mx.remarkmx,
                        outbound_mx.remark`;


        const [res] = await conn.query(sql);
        return res as ISaleOutboundReport[]
    }
}