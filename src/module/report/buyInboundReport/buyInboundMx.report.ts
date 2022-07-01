import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {CodeType} from "../../autoCode/codeType";
import {IInbound} from "../../inbound/inbound";
import {IInboundMx} from "../../inboundMx/inboundMx";
import {IProduct} from "../../product/product";
import {IBuy} from "../../buy/buy";
import {IClient} from "../../client/client";
import {IWarehouse} from "../../warehouse/warehouse";
import {BuyInboundMxReportFindDto} from "./dto/buyInboundMxReportFind.dto";

export interface IBuyInboundMxReport extends IInbound, IInboundMx, IProduct, IBuy, IClient, IWarehouse {

}

@Injectable()
export class BuyInboundMxReport {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async find(findDto: BuyInboundMxReportFindDto) {

        if (findDto.warehouseids.length === 0) {
            return Promise.reject(new Error("查询失败，缺少仓库权限"));
        }

        if (findDto.operateareaids.length === 0) {
            return Promise.reject(new Error("查询失败，缺少操作区域权限"));
        }

        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                        inbound.inboundid,
                        inbound.inboundcode,
                        inbound.inboundtype,
                        inbound.indate,
                        inbound.moneytype,
                        inbound.relatednumber,
                        inbound.remark1,
                        inbound.remark2,
                        inbound.remark3,
                        inbound.remark4,
                        inbound.remark5,
                        inbound.printcount,
                        inbound.level1review,
                        inbound.level1name,
                        inbound.level1date,
                        inbound.level2review,
                        inbound.level2name,
                        inbound.level2date,
                        inbound.creater,
                        inbound.createdAt,
                        inbound.updater,
                        inbound.updatedAt,
                        inbound.warehouseid,
                        inbound.clientid,
                        inbound.buyid,
                        inbound.del_uuid,
                        inbound.deletedAt,
                        inbound.deleter,
                        (
                            SELECT
                                ROUND(
                                    SUM(
                                        inbound_mx.priceqty * inbound_mx.netprice
                                    ),
                                    2
                                )
                            FROM
                                inbound_mx
                            WHERE
                                inbound.inboundid = inbound_mx.inboundid
                        ) AS amt,
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
                        ) AS amt_mx,
                        inbound_mx.agio,
                        inbound_mx.agio1,
                        inbound_mx.agio2,
                        inbound_mx.pricetype,
                        product.productid,
                        product.productcode,
                        product.productname,
                        product.materials,
                        product.spec,
                        product.unit,
                        product.packunit,
                        product.packqty,
                        product.m3,
                        product.length,
                        product.width,
                        product.height,
                        buy.buycode,
                        buy.buyname,
                        client.clientcode,
                        client.clientname,
                        warehouse.warehousecode,
                        warehouse.warehousename
                    FROM
                        inbound
                    INNER JOIN inbound_mx ON inbound.inboundid = inbound_mx.inboundid
                    LEFT JOIN product ON inbound_mx.productid = product.productid
                    LEFT JOIN buy ON buy.buyid = inbound.buyid
                    LEFT JOIN client ON client.clientid = inbound_mx.clientid
                    LEFT JOIN warehouse ON warehouse.warehouseid = inbound.warehouseid
                    WHERE	
                        inbound.del_uuid = 0
                        AND inbound.inboundtype = ${CodeType.buyInbound}
                        AND inbound.level1review = 1
                        AND inbound.level2review = 1
                        AND inbound.warehouseid IN (${conn.escape(findDto.warehouseids)})
                        AND buy.operateareaid IN (${conn.escape(findDto.operateareaids)})
                        ${findDto.startDate.length>0&&findDto.endDate.length>0?` AND DATE(inbound.indate) BETWEEN ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}`:``}
                        ${findDto.inboundcode.length>0?` AND inbound.inboundcode LIKE ${conn.escape(findDto.inboundcode + '%')}`:``}
                        ${findDto.buyid?' AND inbound.buyid = '+conn.escape(findDto.buyid):''}
                        ${findDto.productid ? ` AND product.productid LIKE ${conn.escape(findDto.productid + '%' )}`:``}
                        ${findDto.productcode ? ` AND product.productcode LIKE ${conn.escape(findDto.productcode + '%' )}`:``}
                        ${findDto.productname ? ` AND product.productname LIKE ${conn.escape(findDto.productname + '%' )}`:``}
                        ${findDto.unit ? ` AND product.unit LIKE ${conn.escape(findDto.unit + '%' )}`:``}
                        ${findDto.spec ? ` AND product.spec LIKE ${conn.escape(findDto.spec + '%' )}`:``}
                        ${findDto.materials ? ` AND product.materials LIKE ${conn.escape(findDto.materials + '%' )}`:``}
                        ${findDto.spec_d ? ` AND inbound_mx.spec_d LIKE ${conn.escape(findDto.spec_d + '%' )}`:``}
                        ${findDto.materials_d ? ` AND inbound_mx.materials_d LIKE ${conn.escape(findDto.materials_d + '%' )}`:``}
                        ${findDto.remark ? ` AND inbound_mx.remark LIKE ${conn.escape(findDto.remark + '%' )}`:``}
                        ${findDto.remarkmx ? ` AND inbound_mx.remarkmx LIKE ${conn.escape(findDto.remarkmx + '%' )}`:``}
                    ORDER BY 
                        inbound.inboundid DESC,
                        inbound_mx.printid`;
        const [res] = await conn.query(sql);
        return res as IBuyInboundMxReport[]
    }
}