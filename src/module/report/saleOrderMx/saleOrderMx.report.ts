import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {SaleOrderMxFindReportDto} from "./saleOrderMxFindReport.dto";
import {ISaleOrderMxReport} from "./saleOrderMx";
import {saleOrderAmtColSql, saleOrderEntityColSql} from "../../saleOrder/saleOrder.entity";
import {saleOrderMxAmt, saleOrderMxEntityColSql} from "../../saleOrderMx/saleOrderMx.entity";
import {productEntityColSql} from "../../product/product.entity";

@Injectable()
export class SaleOrderMxReport {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async find(findDto: SaleOrderMxFindReportDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                    SELECT
                        ${saleOrderEntityColSql},
                        client.clientcode,
                        client.clientname,
                        client.ymrep,
                        ${saleOrderAmtColSql},
                        ${saleOrderMxAmt},
                        ${saleOrderMxEntityColSql},
                        ${productEntityColSql}
                    FROM
                        sale_order
                        INNER JOIN sale_order_mx ON sale_order.saleOrderId = sale_order_mx.saleOrderId
                        INNER JOIN client ON client.clientid = sale_order.clientid
                        INNER JOIN product ON product.productid = sale_order_mx.productid
                    WHERE
                        sale_order.del_uuid = 0
                        ${ findDto.saleOrderId           ? ` AND sale_order.saleOrderId = ${conn.escape(findDto.saleOrderId)}` :`` }
                        ${ findDto.saleOrderState        ? ` AND sale_order.saleOrderState = ${conn.escape(findDto.saleOrderState)}` :`` }
                        ${ findDto.saleOrderCode        ? ` AND sale_order.saleOrderCode = ${conn.escape(findDto.saleOrderCode)}` :`` }
                        ${ findDto.clientid              ? ` AND sale_order.clientid = ${conn.escape(findDto.clientid)}` :`` }
                        ${ findDto.salesman              ? ` AND sale_order.salesman = ${conn.escape(findDto.salesman)}` :`` }
                        ${ findDto.clientname.length>0   ? ` AND client.clientname LIKE ${conn.escape(findDto.clientname+'%')}` :`` }
                        ${ findDto.ymrep.length>0        ? ` AND client.ymrep = ${conn.escape(findDto.ymrep)}` :`` }
                        ${ findDto.moneytype.length>0    ? ` AND sale_order.moneytype = ${conn.escape(findDto.moneytype)}` :`` }
                        ${ findDto.relatednumber.length>0? ` AND sale_order.relatednumber = ${conn.escape(findDto.relatednumber)}` :`` }
                        
                        ${ findDto.deposit               ? ` AND sale_order.deposit = ${conn.escape(findDto.deposit)}` :`` }
                        
                        ${ findDto.stopReview !== -1     ? ` AND sale_order.stopReview = ${conn.escape(findDto.stopReview)}` :`` }
                        ${ findDto.manualFinishReview !== -1   ? ` AND sale_order.manualFinishReview = ${conn.escape(findDto.manualFinishReview)}` :`` }
                        ${ findDto.urgentReview  !== -1        ? ` AND sale_order.urgentReview = ${conn.escape(findDto.urgentReview)}` :`` }
                        ${ findDto.level1Review  !== -1        ? ` AND sale_order.level1Review = ${conn.escape(findDto.level1Review)}` :`` }
                        ${ findDto.level2Review  !== -1        ? ` AND sale_order.level2Review = ${conn.escape(findDto.level2Review)}` :`` }
                        ${ findDto.remark1.length>0          ? ` AND sale_order.remark1 = ${conn.escape(findDto.remark1)}` :`` }
                        ${ findDto.remark2.length>0          ? ` AND sale_order.remark2 = ${conn.escape(findDto.remark2)}` :`` }
                        ${ findDto.remark3.length>0          ? ` AND sale_order.remark3 = ${conn.escape(findDto.remark3)}` :`` }
                        ${ findDto.remark4.length>0          ? ` AND sale_order.remark4 = ${conn.escape(findDto.remark4)}` :`` }
                        ${ findDto.remark5.length>0          ? ` AND sale_order.remark5 = ${conn.escape(findDto.remark5)}` :`` }
                        ${findDto.startDate.length>0 && findDto.endDate.length>0 ?
                          ` AND DATE(sale_order.orderDate) BETWEEN  ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}`:
                          ``}
                        ${ findDto.deliveryDate.length>0 ? ` AND DATE(sale_order.deliveryDate) = ${conn.escape(findDto.deliveryDate)}` :`` }
                        
                        ${ findDto.lineClose !== -1 ? ` AND sale_order_mx.lineClose = ${conn.escape(findDto.lineClose)}`:``}
                        ${ findDto.productId ? ` AND sale_order_mx.productid = ${conn.escape(findDto.productId)}`:``}
                        ${ findDto.productCode ? ` AND product.productcode = ${conn.escape(findDto.productCode)}`:``}
                        ${ findDto.productName ? ` AND product.productname = ${conn.escape(findDto.productName)}`:``}
        `;
        const [res] = await conn.query(sql, []);
        return res as ISaleOrderMxReport[]
    }
}