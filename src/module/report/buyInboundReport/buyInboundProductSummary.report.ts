import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {CodeType} from "../../autoCode/codeType";
import {IProduct} from "../../product/product";
import {BuyInboundProductSummaryReportFindDto} from "./dto/buyInboundProductSummaryReportFind.dto";

export interface IBuyInboundSummaryReport extends IProduct{
    amt:number
}

@Injectable()
export class BuyInboundProductSummaryReport {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(findDto:BuyInboundProductSummaryReportFindDto){

        if (findDto.warehouseids.length === 0) {
            return Promise.reject(new Error("查询失败，缺少仓库权限"));
        }

        if (findDto.operateareaids.length === 0) {
            return Promise.reject(new Error("查询失败，缺少操作区域权限"));
        }

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
                                INNER JOIN buy ON buy.buyid = inbound.buyid
                            WHERE
                                inbound.del_uuid = 0
                                AND inbound.inboundtype = ${CodeType.buyInbound}
                                AND inbound.level1review = 1
                                AND inbound.level2review = 1
                                AND inbound.warehouseid IN (${conn.escape(findDto.warehouseids)})
                                AND buy.operateareaid IN (${conn.escape(findDto.operateareaids)})
                                ${findDto.startDate.length>0&&findDto.endDate.length>0?` AND DATE(inbound.indate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}`:``}
                                ${findDto.buyid?' AND inbound.buyid = '+conn.escape(findDto.buyid):''}
                                ${findDto.spec_d ? ` AND inbound_mx.spec_d LIKE ${conn.escape(findDto.spec_d + '%' )}`:``}
                                ${findDto.materials_d ? ` AND inbound_mx.materials_d LIKE ${conn.escape(findDto.materials_d + '%' )}`:``}
                                ${findDto.remark ? ` AND inbound_mx.remark LIKE ${conn.escape(findDto.remark + '%' )}`:``}
                                ${findDto.remarkmx ? ` AND inbound_mx.remarkmx LIKE ${conn.escape(findDto.remarkmx + '%' )}`:``}
                        ) AS buyInboundSummaryReport
                    INNER JOIN product ON product.productid = buyInboundSummaryReport.productid
                    WHERE
                        product.del_uuid = 0
                        ${findDto.productid ? ` AND product.productid LIKE ${conn.escape(findDto.productid + '%' )}`:``}
                        ${findDto.productcode ? ` AND product.productcode LIKE ${conn.escape(findDto.productcode + '%' )}`:``}
                        ${findDto.productname ? ` AND product.productname LIKE ${conn.escape(findDto.productname + '%' )}`:``}
                        ${findDto.unit ? ` AND product.unit LIKE ${conn.escape(findDto.unit + '%' )}`:``}
                        ${findDto.spec ? ` AND product.spec LIKE ${conn.escape(findDto.spec + '%' )}`:``}
                        ${findDto.materials ? ` AND product.materials LIKE ${conn.escape(findDto.materials + '%' )}`:``}
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