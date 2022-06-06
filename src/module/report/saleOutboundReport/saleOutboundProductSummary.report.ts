import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {IOutbound} from "../../outbound/outbound";
import {IOutboundMx} from "../../outboundMx/outboundMx";
import {FindSaleOutboundDto} from "./dto/findSaleOutbound.dto";
import {CodeType} from "../../autoCode/codeType";

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
                        ROUND(SUM(saleOutboundReport.priceqty),4) AS priceqty,
                        ROUND(SUM(saleOutboundReport.amt),2) AS amt
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
                                outbound_mx.clientid,
                                outbound_mx.warehouseid,
                                outbound_mx.ratePrice,
                                outbound_mx.beforeAmount,
                                outbound_mx.amount,
                                outbound_mx.taxInclusiveAmount,
                                product.productcode,
                                product.productname,
                                product.materials,
                                product.spec,
                                product.unit
                            FROM
                                outbound_mx
                            INNER JOIN product ON outbound_mx.productid = product.productid
                            INNER JOIN outbound ON outbound.outboundid = outbound_mx.outboundid
                            WHERE
                                outbound.del_uuid = 0
                            AND outbound.outboundtype = 8
                        ) AS saleOutboundReport
                    GROUP BY
                        saleOutboundReport.productid,
                        saleOutboundReport.spec_d,
                        saleOutboundReport.materials_d,
                        saleOutboundReport.remarkmx,
                        saleOutboundReport.remark`;


        const [res] = await conn.query(sql);
        if ((res as ISaleOutboundReport[]).length > 0) {
            return (res as ISaleOutboundReport[]);
        } else {
            return Promise.reject(new Error('查询销售单汇总表失败'));
        }
    }
}