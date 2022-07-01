import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {ISaleGrossMarginSum} from "./saleGrossMarginSum";
import {CodeType} from "../../autoCode/codeType";
import {SaleGrossMarginSumFindDto} from "./dto/saleGrossMarginSumFind.dto";

@Injectable()
export class SaleGrossMarginSumReportService {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(findDto:SaleGrossMarginSumFindDto){

        if (findDto.warehouseids.length === 0) {
            return Promise.reject(new Error("查询失败，缺少仓库权限"));
        }

        if (findDto.operateareaids.length === 0) {
            return Promise.reject(new Error("查询失败，缺少操作区域权限"));
        }

        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT 
                         saleGrossMarginSum.productcode,
                         saleGrossMarginSum.productname,
                         saleGrossMarginSum.materials,
                         saleGrossMarginSum.spec,
                         saleGrossMarginSum.unit,
                         saleGrossMarginSum.spec_d,
                         saleGrossMarginSum.materials_d,
                         saleGrossMarginSum.remarkmx,
                         saleGrossMarginSum.remark,
                         saleGrossMarginSum.priceqty,
                         ( saleGrossMarginSum.amt / saleGrossMarginSum.priceqty ) as netprice,
                         saleGrossMarginSum.amt,
                         saleGrossMarginSum.weightedAveragePrice_thisMonth,
                         IFNULL(saleGrossMarginSum.priceqty * IFNULL(saleGrossMarginSum.weightedAveragePrice_thisMonth,0),0) as amount_saleCost_thisMonth,
                         (saleGrossMarginSum.amt - IFNULL(saleGrossMarginSum.priceqty * IFNULL(saleGrossMarginSum.weightedAveragePrice_thisMonth,0),0)) as saleGrossMargin,
                         ((saleGrossMarginSum.amt - IFNULL(saleGrossMarginSum.priceqty * IFNULL(saleGrossMarginSum.weightedAveragePrice_thisMonth,0),0)) / saleGrossMarginSum.amt) as saleGrossMarginRate
                     FROM (
                         SELECT
                             product.productcode,
                             product.productname,
                             product.materials,
                             product.spec,
                             product.unit,
                             outbound_mx.spec_d,
                             outbound_mx.materials_d,
                             outbound_mx.remarkmx,
                             outbound_mx.remark,
                             SUM(outbound_mx.priceqty) as priceqty,
                             SUM(outbound_mx.priceqty *
                             outbound_mx.netprice) as amt,
                             IFNULL(weightedAverageRecordMx.price,0) as weightedAveragePrice_thisMonth
                         FROM
                             outbound
                             INNER JOIN outbound_mx ON outbound.outboundid = outbound_mx.outboundid
                             INNER JOIN product ON outbound_mx.productid = product.productid
                             INNER JOIN client ON client.clientid = outbound.clientid
                             LEFT JOIN ( 
                               SELECT
                                weighted_average_record_mx.price,
                                weighted_average_record.inDate,
                                weighted_average_record_mx.productid,
                                weighted_average_record_mx.spec_d,
                                weighted_average_record_mx.materials_d,
                                weighted_average_record_mx.remark,
                                weighted_average_record_mx.remarkmx
                               FROM
                                weighted_average_record_mx
                                INNER JOIN weighted_average_record ON weighted_average_record_mx.weightedAverageRecordId = weighted_average_record.weightedAverageRecordId
                              ) as weightedAverageRecordMx ON 
                             DATE_FORMAT(weightedAverageRecordMx.inDate,'%Y-%m') = DATE_FORMAT(${conn.escape(findDto.startDate)},'%Y-%m')
                             AND weightedAverageRecordMx.productid = outbound_mx.productid
                             AND weightedAverageRecordMx.spec_d = outbound_mx.spec_d
                             AND weightedAverageRecordMx.materials_d = outbound_mx.materials_d
                             AND weightedAverageRecordMx.remark = outbound_mx.remark
                             AND weightedAverageRecordMx.remarkmx = outbound_mx.remarkmx
                         WHERE 
                             outbound.del_uuid = 0
                             AND outbound.outboundtype = ${CodeType.XS}
                             AND outbound.level1review = 1
                             AND outbound.level2review = 1
                             AND outbound.warehouseid IN (${conn.escape(findDto.warehouseids)})
                             AND client.operateareaid IN (${conn.escape(findDto.operateareaids)})
                             ${findDto.startDate.length>0&&findDto.endDate.length>0?`AND DATE(outbound.outdate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}`:``}
                             ${findDto.clientid?' AND outbound.clientid = '+conn.escape(findDto.clientid):''}
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
                         GROUP BY
                             outbound_mx.productid,
                             outbound_mx.spec_d,
                             outbound_mx.materials_d,
                             outbound_mx.remarkmx,
                             outbound_mx.remark
                     ) as saleGrossMarginSum`;
        const [res] = await conn.query(sql);
        return res  as ISaleGrossMarginSum[]
    }
}