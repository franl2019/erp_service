import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {ISaleOrderMx} from "./saleOrderMx";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class SaleOrderMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async find(saleOrderId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                         sale_order_mx.saleOrderId,
                         sale_order_mx.printid,
                         sale_order_mx.productid,
                         sale_order_mx.spec_d,
                         sale_order_mx.materials_d,
                         sale_order_mx.batchNo,
                         sale_order_mx.remarkmx,
                         sale_order_mx.remark,
                         sale_order_mx.outqty,
                         sale_order_mx.bzqty,
                         sale_order_mx.priceqty,
                         sale_order_mx.price,
                         sale_order_mx.bzprice,
                         sale_order_mx.netprice,
                         sale_order_mx.floatprice1,
                         sale_order_mx.floatprice2,
                         sale_order_mx.floatprice3,
                         sale_order_mx.agio1,
                         sale_order_mx.agio2,
                         sale_order_mx.agio3,
                         sale_order_mx.exchangeRate,
                         sale_order_mx.rate,
                         sale_order_mx.ratePrice,
                         sale_order_mx.rateAmount,
                         sale_order_mx.pricetype,
                         sale_order_mx.openQty,
                         sale_order_mx.stopQty,
                         sale_order_mx.saleQty
                     FROM
                         sale_order_mx
                     WHERE
                         sale_order_mx.saleOrderId = ?
        `;
        const [res] = await conn.query(sql, [saleOrderId]);
        return res as ISaleOrderMx[]
    }

    public async create(saleOrderMxList: ISaleOrderMx[]) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO sale_order_mx (
                         sale_order_mx.saleOrderId,
                         sale_order_mx.printid,
                         sale_order_mx.productid,
                         sale_order_mx.spec_d,
                         sale_order_mx.materials_d,
                         sale_order_mx.batchNo,
                         sale_order_mx.remarkmx,
                         sale_order_mx.remark,
                         sale_order_mx.outqty,
                         sale_order_mx.bzqty,
                         sale_order_mx.priceqty,
                         sale_order_mx.price,
                         sale_order_mx.bzprice,
                         sale_order_mx.netprice,
                         sale_order_mx.floatprice1,
                         sale_order_mx.floatprice2,
                         sale_order_mx.floatprice3,
                         sale_order_mx.agio1,
                         sale_order_mx.agio2,
                         sale_order_mx.agio3,
                         sale_order_mx.exchangeRate,
                         sale_order_mx.rate,
                         sale_order_mx.ratePrice,
                         sale_order_mx.rateAmount,
                         sale_order_mx.pricetype,
                         sale_order_mx.openQty,
                         sale_order_mx.stopQty,
                         sale_order_mx.saleQty
                         ) VALUES ? 
                         `;
        const [res] = await conn.query<ResultSetHeader>(sql,[saleOrderMxList.map(saleOrderMx => [
            saleOrderMx.saleOrderId,
            saleOrderMx.printid,
            saleOrderMx.productid,
            saleOrderMx.spec_d,
            saleOrderMx.materials_d,
            saleOrderMx.batchNo,
            saleOrderMx.remarkmx,
            saleOrderMx.remark,
            saleOrderMx.outqty,
            saleOrderMx.bzqty,
            saleOrderMx.priceqty,
            saleOrderMx.price,
            saleOrderMx.bzprice,
            saleOrderMx.netprice,
            saleOrderMx.floatprice1,
            saleOrderMx.floatprice2,
            saleOrderMx.floatprice3,
            saleOrderMx.agio1,
            saleOrderMx.agio2,
            saleOrderMx.agio3,
            saleOrderMx.exchangeRate,
            saleOrderMx.rate,
            saleOrderMx.ratePrice,
            saleOrderMx.rateAmount,
            saleOrderMx.pricetype,
            saleOrderMx.openQty,
            saleOrderMx.stopQty,
            saleOrderMx.saleQty
        ])])
        if(res.affectedRows >0){
            return res;
        }else{
            return Promise.reject(new Error('新增销售订单明细失败'))
        }
    }

    public async delete_data(saleOrderId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM
                        sale_order_mx
                     WHERE
                        sale_order_mx.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[saleOrderId]);
        if(res.affectedRows>0){
            return res
        }else{
            return Promise.reject(new Error('删除销售订单明细失败'));
        }
    }
}