import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {PsiMonthReportFindDto} from "./dto/psiMonthReportFind.dto";
import {IPsiMonthReport} from "./psiMonthReport";
import * as moment from "moment";
@Injectable()
export class PsiMonthReport {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(findDto:PsiMonthReportFindDto){
        const lastMonth = moment(findDto.startDate).subtract(1, 'months').format('YYYY-MM')
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        PsiMonthReport.productid,
                        PsiMonthReport.productcode,
                        PsiMonthReport.productname,
                        PsiMonthReport.materials,
                        PsiMonthReport.spec,
                        PsiMonthReport.unit,
                        PsiMonthReport.spec_d,
                        PsiMonthReport.materials_d,
                        PsiMonthReport.remark,
                        PsiMonthReport.remarkmx,
                        PsiMonthReport.weightedAveragePrice_lastMonth,
                        PsiMonthReport.qty_lastMonth,
                        PsiMonthReport.amount_lastMonth,
                        PsiMonthReport.qty_buy_thisMonth,
                        IFNULL(
                          ROUND(
                            (
                                PsiMonthReport.amount_buy_thisMonth / PsiMonthReport.qty_buy_thisMonth
                            ),
                            2
                        ),0) as price_buy_thisMonth,
                        PsiMonthReport.amount_buy_thisMonth,
                        PsiMonthReport.qty_sale_thisMonth as qty_saleCost_thisMonth,
                        ROUND(
                            (
                                PsiMonthReport.qty_sale_thisMonth * PsiMonthReport.weightedAveragePrice_thisMonth
                            ),
                            2
                        ) as amount_saleCost_thisMonth,
                        PsiMonthReport.qty_sale_thisMonth,
                        PsiMonthReport.amount_sale_thisMonth,
                        ROUND(
                            (
                                PsiMonthReport.qty_lastMonth + PsiMonthReport.qty_buy_thisMonth - PsiMonthReport.qty_sale_thisMonth
                            ),
                            4
                        ) as balanceQty_thisMonth,
                        PsiMonthReport.weightedAveragePrice_thisMonth,
                        ROUND(
                            ROUND(
                                (
                                    PsiMonthReport.qty_lastMonth + PsiMonthReport.qty_buy_thisMonth - PsiMonthReport.qty_sale_thisMonth
                                ),
                                4
                            ) * PsiMonthReport.weightedAveragePrice_thisMonth,
                            2
                        ) as balanceAmount_thisMonth
                    FROM
                        (
                            SELECT
                                inventory.productid,
                                product.productcode,
                                product.productname,
                                product.materials,
                                product.spec,
                                product.unit,
                                inventory.spec_d,
                                inventory.materials_d,
                                inventory.remark,
                                inventory.remarkmx,
                                IFNULL(lastMonth.price, 0) as weightedAveragePrice_lastMonth,
                                IFNULL(lastMonth.qty, 0) as qty_lastMonth,
                                IFNULL(lastMonth.amount, 0) as amount_lastMonth,
                                IFNULL(
                                    buyThisMonth.qty_buy_thisMonth,
                                    0
                                ) as qty_buy_thisMonth,
                                IFNULL(
                                    buyThisMonth.amount_buy_thisMonth,
                                    0
                                ) as amount_buy_thisMonth,
                                IFNULL(
                                    saleThisMonth.qty_sale_thisMonth,
                                    0
                                ) as qty_sale_thisMonth,
                                IFNULL(
                                    saleThisMonth.amount_sale_thisMonth,
                                    0
                                ) as amount_sale_thisMonth,
                                IFNULL(
                                    ROUND(
                                        (
                                            (
                                                IFNULL(lastMonth.amount, 0) + IFNULL(
                                                    buyThisMonth.amount_buy_thisMonth,
                                                    0
                                                ) / (
                                                    IFNULL(lastMonth.qty, 0) + IFNULL(
                                                        buyThisMonth.qty_buy_thisMonth,
                                                        0
                                                    )
                                                )
                                            )
                                        ),
                                        2
                                    ),
                                    0
                                ) as weightedAveragePrice_thisMonth
                            FROM
                                inventory
                            INNER JOIN product ON inventory.productid = product.productid
                            
                            
                            LEFT JOIN (
                                SELECT
                                    inbound_mx.productid,
                                    inbound_mx.spec_d,
                                    inbound_mx.materials_d,
                                    inbound_mx.remark,
                                    inbound_mx.remarkmx,
                                    SUM(inbound_mx.priceqty) as qty_buy_thisMonth,
                                    SUM(
                                        (
                                            inbound_mx.priceqty * inbound_mx.netprice
                                        )
                                    ) as amount_buy_thisMonth
                                FROM
                                    inbound_mx
                                LEFT JOIN inbound ON inbound_mx.inboundid = inbound.inboundid
                                WHERE
                                    inbound.del_uuid = 0
                                    AND inbound.level1review = 1
                                    AND inbound.level2review = 1
                                    AND DATE(inbound.indate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}
                                GROUP BY
                                    inbound_mx.productid,
                                    inbound_mx.spec_d,
                                    inbound_mx.materials_d,
                                    inbound_mx.remark,
                                    inbound_mx.remarkmx
                            ) as buyThisMonth ON buyThisMonth.productid = inventory.productid
                            AND buyThisMonth.spec_d = inventory.spec_d
                            AND buyThisMonth.materials_d = inventory.materials_d
                            AND buyThisMonth.remark = inventory.remark
                            AND buyThisMonth.remarkmx = inventory.remarkmx
                            
                            
                            LEFT JOIN (
                                SELECT
                                    outbound_mx.productid,
                                    outbound_mx.spec_d,
                                    outbound_mx.materials_d,
                                    outbound_mx.remark,
                                    outbound_mx.remarkmx,
                                    SUM(outbound_mx.priceqty) as qty_sale_thisMonth,
                                    Sum(
                                        (
                                            outbound_mx.priceqty * outbound_mx.netprice
                                        )
                                    ) as amount_sale_thisMonth
                                FROM
                                    outbound_mx
                                INNER JOIN outbound ON outbound_mx.outboundid = outbound.outboundid
                                WHERE
                                    outbound.del_uuid = 0
                                    AND outbound.level1review = 1
                                    AND outbound.level2review = 1
                                    AND DATE(outbound.outdate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}
                                GROUP BY
                                    outbound_mx.productid,
                                    outbound_mx.spec_d,
                                    outbound_mx.materials_d,
                                    outbound_mx.remark,
                                    outbound_mx.remarkmx
                            ) as saleThisMonth ON saleThisMonth.productid = inventory.productid
                            AND saleThisMonth.spec_d = inventory.spec_d
                            AND saleThisMonth.materials_d = inventory.materials_d
                            AND saleThisMonth.remark = inventory.remark
                            AND saleThisMonth.remarkmx = inventory.remarkmx
                            
                            
                            LEFT JOIN (
                                SELECT
                                    weighted_average_record_mx.productid,
                                    weighted_average_record_mx.spec_d,
                                    weighted_average_record_mx.materials_d,
                                    weighted_average_record_mx.remark,
                                    weighted_average_record_mx.remarkmx,
                                    weighted_average_record_mx.qty,
                                    weighted_average_record_mx.price,
                                    weighted_average_record_mx.amount
                                FROM
                                    weighted_average_record_mx
                                    INNER JOIN weighted_average_record on weighted_average_record_mx.weightedAverageRecordId = weighted_average_record.weightedAverageRecordId
                                WHERE
                                    weighted_average_record.inDate LIKE ${conn.escape(lastMonth + '%')}
                                    
                            ) as lastMonth ON lastMonth.productid = inventory.productid
                            AND lastMonth.spec_d = inventory.spec_d
                            AND lastMonth.materials_d = inventory.materials_d
                            AND lastMonth.remark = inventory.remark
                            AND lastMonth.remarkmx = inventory.remarkmx
                        ) as PsiMonthReport
        `;
        console.log(sql)
        const [res]= await conn.query(sql);
        return res as IPsiMonthReport[]
    }
}