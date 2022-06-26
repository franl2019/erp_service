import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {CodeType} from "../../autoCode/codeType";
import {SaleGrossMarginMxReportFindDto} from "./dto/saleGrossMarginMxReportFind.dto";
import {ISaleGrossMarginMx} from "./saleGrossMarginMx";

@Injectable()
export class SaleGrossMarginMxReportService {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(findDto:SaleGrossMarginMxReportFindDto){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                         outbound.outboundcode,
                         client.clientcode,
                         client.clientname,
                         product.productcode,
                         product.productname,
                         product.materials,
                         product.spec,
                         product.unit,
                         outbound_mx.spec_d,
                         outbound_mx.materials_d,
                         outbound_mx.remarkmx,
                         outbound_mx.remark,
                         client.ymrep,
                         outbound.outdate,
                         outbound_mx.priceqty,
                         outbound_mx.netprice,
                         (outbound_mx.priceqty *
                         outbound_mx.netprice) as amt,
                         IFNULL(weightedAverageRecordMx.price,0) as weightedAveragePrice_thisMonth,
                         IFNULL(outbound_mx.priceqty * IFNULL(weightedAverageRecordMx.price,0),0) as amount_saleCost_thisMonth,
                         ((outbound_mx.priceqty * outbound_mx.netprice) 
                           - IFNULL(outbound_mx.priceqty * IFNULL(weightedAverageRecordMx.price,0),0)) as saleGrossMargin,
                         (((outbound_mx.priceqty * outbound_mx.netprice) 
                           - IFNULL(outbound_mx.priceqty * IFNULL(weightedAverageRecordMx.price,0),0)) 
                           / (outbound_mx.priceqty * outbound_mx.netprice)) as saleGrossMarginRate
                         FROM
                         outbound
                         INNER JOIN outbound_mx ON outbound.outboundid = outbound_mx.outboundid
                         LEFT JOIN client ON outbound.clientid = client.clientid
                         LEFT JOIN product ON outbound_mx.productid = product.productid
                         LEFT JOIN ( 
                             SELECT
                                weighted_average_record.inDate,
                                weighted_average_record_mx.price,
                                weighted_average_record_mx.productid,
                                weighted_average_record_mx.spec_d,
                                weighted_average_record_mx.materials_d,
                                weighted_average_record_mx.remark,
                                weighted_average_record_mx.remarkmx
                             FROM
                                weighted_average_record_mx
                                INNER JOIN weighted_average_record ON weighted_average_record_mx.weightedAverageRecordId = weighted_average_record.weightedAverageRecordId
                              ) as weightedAverageRecordMx ON DATE_FORMAT(weightedAverageRecordMx.inDate,'%Y-%m') = DATE_FORMAT(outbound.outdate,'%Y-%m')
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
                         AND DATE(outbound.outdate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}
                         ${findDto.clientid?'AND outbound.clientid = '+conn.escape(findDto.clientid):''}`;
        console.log(sql)
        const [res] = await conn.query(sql);
        return res as ISaleGrossMarginMx[]
    }
}