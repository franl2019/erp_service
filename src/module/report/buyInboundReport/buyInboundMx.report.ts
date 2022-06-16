import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {CodeType} from "../../autoCode/codeType";
import {IInbound} from "../../inbound/inbound";
import {IInboundMx} from "../../inboundMx/inboundMx";
import {IProduct} from "../../product/product";
import {IBuy} from "../../buy/buy";
import {IClient} from "../../client/client";
import {IWarehouse} from "../../warehouse/warehouse";

export interface IBuyInboundMxReport extends IInbound,IInboundMx,IProduct,IBuy,IClient,IWarehouse{

}

@Injectable()
export class BuyInboundMxReport {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async find(){
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
                        AND inbound.inboundtype = ${CodeType.buyInbound}`;
        const [res] = await conn.query(sql);
        return res as IBuyInboundMxReport[]
    }
}