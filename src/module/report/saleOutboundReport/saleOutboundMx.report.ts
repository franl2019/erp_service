import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {IOutbound} from "../../outbound/outbound";
import {IOutboundMx} from "../../outboundMx/outboundMx";
import {FindSaleOutboundDto} from "./dto/findSaleOutbound.dto";
import {CodeType} from "../../autoCode/codeType";

export interface ISaleOutboundMxReport extends IOutbound, IOutboundMx {
}

@Injectable()
export class SaleOutboundMxReport {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async find(findDto: FindSaleOutboundDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                        outbound.outboundid, 
                        outbound.outboundcode, 
                        outbound.outboundtype, 
                        outbound.outdate, 
                        outbound.moneytype, 
                        outbound.relatednumber, 
                        outbound.remark1, 
                        outbound.remark2, 
                        outbound.remark3, 
                        outbound.remark4, 
                        outbound.remark5, 
                        outbound.printcount, 
                        outbound.level1review, 
                        outbound.level1name, 
                        outbound.level1date, 
                        outbound.level2review, 
                        outbound.level2name, 
                        outbound.level2date, 
                        outbound.creater, 
                        outbound.createdAt, 
                        outbound.updater, 
                        outbound.updatedAt, 
                        outbound.warehouseid,
                        outbound.clientid,
                        outbound.del_uuid, 
                        outbound.deletedAt, 
                        outbound.deleter,
                        (
                            SELECT
                                round(
                                    SUM(
                                        outbound_mx.priceqty * outbound_mx.netprice
                                    ),2
                                )
                            FROM
                                outbound_mx
                            WHERE
                                outbound.outboundid = outbound_mx.outboundid
                        ) AS amt,
                        client.clientcode,
                        client.clientname,
                        client.ymrep,
                        client.salesman,
                        warehouse.warehousename,
                        warehouse.warehousecode,
                        outbound_mx.outboundid,
                        outbound_mx.printid,
                        outbound_mx.inventoryid,
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
                        ROUND( outbound_mx.priceqty * outbound_mx.netprice,2) AS amt_mx,
                        outbound_mx.floatprice1,
                        outbound_mx.floatprice2,
                        outbound_mx.floatprice3,
                        outbound_mx.agio,
                        outbound_mx.agio1,
                        outbound_mx.agio2,
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
                        product.spec,
                        product.materials
                   FROM
                        outbound
                        INNER JOIN outbound_mx ON outbound.outboundid = outbound_mx.outboundid
                        INNER JOIN client ON outbound.clientid = client.clientid
                        LEFT JOIN warehouse ON outbound.warehouseid = warehouse.warehouseid
                        LEFT JOIN product ON outbound_mx.productid = product.productid
                   WHERE
                        outbound.del_uuid = 0
                        AND outbound.outboundtype = ${CodeType.XS}`;
        const params = [];

        //按仓库查询
        if (findDto.warehouseids.length > 0) {
            sql = sql + ` AND outbound.warehouseid IN (?)`;
            params.push(findDto.warehouseids);
        } else {
            return Promise.reject(new Error("查询出仓单失败，缺少仓库权限ID"));
        }

        //按客户查询
        if (findDto.clientid !== 0) {
            sql = sql + ` AND outbound.clientid = ?`;
            params.push(findDto.clientid);
        }

        //按操作区域查询
        if (findDto.operateareaids.length > 0) {
            sql = sql + ` AND client.operateareaid IN (?)`;
            params.push(findDto.operateareaids);
        } else {
            return Promise.reject(new Error("查询出仓单失败，缺少操作区域权限ID"));
        }

        //按出仓日期范围查询
        if (findDto.startDate.length > 0 && findDto.endDate.length > 0) {
            sql = sql + ` AND DATE(outbound.outdate) BETWEEN ? AND ?`;
            params.push(findDto.startDate, findDto.endDate);
        }

        //按id查询
        if (findDto.outboundid !== 0) {
            sql = sql + ` AND outbound.outboundid = ?`;
            params.push(findDto.outboundid);
        }

        //按出仓单编号查询
        if (findDto.outboundcode.length > 0) {
            sql = sql + ` AND outbound.outboundcode LIKE ?`;
            params.push(`%${findDto.outboundcode}%`);
        }

        //按出仓单相关号码查询
        if (findDto.relatednumber.length > 0) {
            sql = sql + ` AND outbound.relatednumber LIKE ?`;
            params.push(`%${findDto.relatednumber}%`);
        }

        sql = sql + ` ORDER BY
                        outbound.outboundcode DESC,
                        outbound_mx.printid ASC`;

        //分页查询
        if (findDto.page > 0 && findDto.pagesize > 0) {
            sql = sql + ` LIMIT ?,?`;
            params.push(findDto.page, findDto.pagesize);
        }

        const [res] = await conn.query(sql, params);
        return res as ISaleOutboundMxReport[]
    }
}