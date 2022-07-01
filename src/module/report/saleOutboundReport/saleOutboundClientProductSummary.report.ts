import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {SaleOutboundClientProductSummaryReportFindDto} from "./dto/saleOutboundClientProductSummaryReportFind.dto";
import {CodeType} from "../../autoCode/codeType";

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

    public async find(findDto:SaleOutboundClientProductSummaryReportFindDto) {

        if (findDto.warehouseids.length === 0) {
            return Promise.reject(new Error("查询失败，缺少仓库权限"));
        }

        if (findDto.operateareaids.length === 0) {
            return Promise.reject(new Error("查询失败，缺少操作区域权限"));
        }

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
                        ) as priceqty,
                        SUM(saleOutboundReport.amt) as amt 
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
                            INNER JOIN client ON client.clientid = outbound.clientid
                            WHERE
                                outbound.del_uuid = 0
                                AND outbound.outboundtype = ${CodeType.XS}
                                AND outbound.warehouseid IN (${conn.escape(findDto.warehouseids)})
                                ${findDto.startDate.length>0&&findDto.endDate.length>0 ? ` AND DATE(outbound.outdate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}`:``}
                                ${findDto.clientid ? ` AND outbound.clientid LIKE ${conn.escape(findDto.clientid + '%' )}`:``}
                                ${findDto.clientname ? ` AND client.clientname LIKE ${conn.escape(findDto.clientname + '%' )}`:``}
                                ${findDto.clientcode ? ` AND client.clientcode LIKE ${conn.escape(findDto.clientcode + '%' )}`:``}
                                ${findDto.productid ? ` AND product.productid LIKE ${conn.escape(findDto.productid + '%' )}`:``}
                                ${findDto.productcode ? ` AND product.productcode LIKE ${conn.escape(findDto.productcode + '%' )}`:``}
                                ${findDto.productname ? ` AND product.productname LIKE ${conn.escape(findDto.productname + '%' )}`:``}
                                ${findDto.unit ? ` AND product.unit LIKE ${conn.escape(findDto.unit + '%' )}`:``}
                                ${findDto.spec ? ` AND product.spec LIKE ${conn.escape(findDto.spec + '%' )}`:``}
                                ${findDto.materials ? ` AND product.materials LIKE ${conn.escape(findDto.materials + '%' )}`:``}
                                ${findDto.spec_d ? ` AND outbound_mx.spec_d LIKE ${conn.escape(findDto.spec_d + '%' )}`:``}
                                ${findDto.materials_d ? ` AND outbound_mx.materials_d LIKE ${conn.escape(findDto.materials_d + '%' )}`:``}
                                ${findDto.remark ? ` AND outbound_mx.remark LIKE ${conn.escape(findDto.remark + '%' )}`:``}
                                ${findDto.remarkmx ? ` AND outbound_mx.remarkmx LIKE ${conn.escape(findDto.remarkmx + '%' )}`:``}
                        ) as saleOutboundReport
                    LEFT JOIN client ON client.clientid = saleOutboundReport.clientid
                    WHERE
                        1 = 1
                        AND client.operateareaid IN (${conn.escape(findDto.operateareaids)})
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