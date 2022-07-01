import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {SaleOutboundProductSummaryReportFindDto} from "./dto/saleOutboundProductSummaryReportFind.dto";
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

    public async find(findDto:SaleOutboundProductSummaryReportFindDto) {

        if (findDto.warehouseids.length === 0) {
            return Promise.reject(new Error("查询失败，缺少仓库权限"));
        }

        if (findDto.operateareaids.length === 0) {
            return Promise.reject(new Error("查询失败，缺少操作区域权限"));
        }

        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                        product.productid,
                        product.productcode,
                        product.productname,
                        product.materials,
                        product.spec,
                        product.unit,
                        uv_outbound_mx.spec_d,
                        uv_outbound_mx.materials_d,
                        uv_outbound_mx.remarkmx,
                        uv_outbound_mx.remark,
                        IFNULL(uv_outbound_mx.outqty,0) as outqty,
                        IFNULL(uv_outbound_mx.bzqty,0) as bzqty,
                        IFNULL(uv_outbound_mx.priceqty,0) as priceqty,
                        IFNULL(uv_outbound_mx.amt,0) as amt
                   FROM
                        product
                        LEFT JOIN (
                            SELECT
                                outbound_mx.productid,
                                outbound_mx.spec_d,
                                outbound_mx.materials_d,
                                outbound_mx.remarkmx,
                                outbound_mx.remark,
                                outbound_mx.outqty,
                                outbound_mx.bzqty,
                                SUM(outbound_mx.priceqty) as priceqty,
                                SUM(outbound_mx.priceqty * outbound_mx.netprice) as amt
                            FROM
                                outbound_mx
                                INNER JOIN outbound on outbound.outboundid = outbound_mx.outboundid
                                INNER JOIN client on client.clientid = outbound.clientid
                            WHERE
                                outbound.del_uuid = 0
                                AND outbound.outboundtype = ${CodeType.XS}
                                AND client.operateareaid IN (${conn.escape(findDto.operateareaids)})
                                AND outbound.warehouseid IN (${conn.escape(findDto.warehouseids)})
                                ${findDto.startDate.length>0&&findDto.endDate.length>0 ? ` AND DATE(outbound.outdate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}`:``}
                            GROUP BY
                                outbound_mx.productid,
                                outbound_mx.spec_d,
                                outbound_mx.materials_d,
                                outbound_mx.remarkmx,
                                outbound_mx.remark
                        ) as uv_outbound_mx on uv_outbound_mx.productid = product.productid
                   WHERE
                        product.del_uuid = 0
                        ${findDto.productid ? ` AND product.productid LIKE ${conn.escape(findDto.productid + '%' )}`:``}
                        ${findDto.productcode ? ` AND product.productcode LIKE ${conn.escape(findDto.productcode + '%' )}`:``}
                        ${findDto.productname ? ` AND product.productname LIKE ${conn.escape(findDto.productname + '%' )}`:``}
                        ${findDto.unit ? ` AND product.unit LIKE ${conn.escape(findDto.unit + '%' )}`:``}
                        ${findDto.spec ? ` AND product.spec LIKE ${conn.escape(findDto.spec + '%' )}`:``}
                        ${findDto.materials ? ` AND product.materials LIKE ${conn.escape(findDto.materials + '%' )}`:``}
                        ${findDto.spec_d ? ` AND uv_outbound_mx.spec_d LIKE ${conn.escape(findDto.spec_d + '%' )}`:``}
                        ${findDto.materials_d ? ` AND uv_outbound_mx.materials_d LIKE ${conn.escape(findDto.materials_d + '%' )}`:``}
                        ${findDto.remark ? ` AND uv_outbound_mx.remark LIKE ${conn.escape(findDto.remark + '%' )}`:``}
                        ${findDto.remarkmx ? ` AND uv_outbound_mx.remarkmx LIKE ${conn.escape(findDto.remarkmx + '%' )}`:``}
                        `;


        const [res] = await conn.query(sql);
        return res as ISaleOutboundReport[]
    }
}