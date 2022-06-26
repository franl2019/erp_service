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