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
        const sql = `select 
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
                           sale_order_mx.agio,
                           sale_order_mx.agio1,
                           sale_order_mx.agio2,
                           sale_order_mx.exchangeRate,
                           sale_order_mx.rate,
                           sale_order_mx.ratePrice,
                           sale_order_mx.rateAmount,
                           sale_order_mx.pricetype,
                           sale_order_mx.openQty,
                           sale_order_mx.stopQty,
                           sale_order_mx.saleQty,
                           sale_order_mx.warehouseid,
                           sale_order_mx.otherUnit,
                           sale_order_mx.otherUnitConversionRate,
                           sale_order_mx.kz_productCode,
                           sale_order_mx.kz_productName,
                           sale_order_mx.kz_spec,
                           sale_order_mx.kz_materials,
                           sale_order_mx.kz_remark,
                           sale_order_mx.kz_spec_d,
                           sale_order_mx.kz_materials_d,
                           sale_order_mx.remark1,
                           sale_order_mx.remark2,
                           sale_order_mx.remark3,
                           sale_order_mx.remark4,
                           sale_order_mx.remark5,
                           sale_order_mx.lineClose,
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
                           product.height
                    from 
                        sale_order_mx
                        INNER JOIN product on product.productid = sale_order_mx.productid
                    WHERE
                        sale_order_mx.saleOrderId = ?
        `;
        const [res] = await conn.query(sql, [saleOrderId]);
        return res as ISaleOrderMx[]
    }

    public async findOne(saleOrderId: number,saleOrderMxId:number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `select 
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
                           sale_order_mx.agio,
                           sale_order_mx.agio1,
                           sale_order_mx.agio2,
                           sale_order_mx.exchangeRate,
                           sale_order_mx.rate,
                           sale_order_mx.ratePrice,
                           sale_order_mx.rateAmount,
                           sale_order_mx.pricetype,
                           sale_order_mx.openQty,
                           sale_order_mx.stopQty,
                           sale_order_mx.saleQty,
                           sale_order_mx.warehouseid,
                           sale_order_mx.otherUnit,
                           sale_order_mx.otherUnitConversionRate,
                           sale_order_mx.kz_productCode,
                           sale_order_mx.kz_productName,
                           sale_order_mx.kz_spec,
                           sale_order_mx.kz_materials,
                           sale_order_mx.kz_remark,
                           sale_order_mx.kz_spec_d,
                           sale_order_mx.kz_materials_d,
                           sale_order_mx.remark1,
                           sale_order_mx.remark2,
                           sale_order_mx.remark3,
                           sale_order_mx.remark4,
                           sale_order_mx.remark5,
                           sale_order_mx.lineClose
                    from 
                        sale_order_mx
                    WHERE
                        sale_order_mx.saleOrderId = ?
                        AND sale_order_mx.printid = ?
        `;
        const [res] = await conn.query(sql, [
            saleOrderId,
            saleOrderMxId
        ]);
        if((res as ISaleOrderMx[]).length > 0){
            return (res as ISaleOrderMx[])[0]
        }else{
            return Promise.reject(new Error('查找销售订单明细单行失败'))
        }
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
                           sale_order_mx.agio,
                           sale_order_mx.agio1,
                           sale_order_mx.agio2,
                           sale_order_mx.exchangeRate,
                           sale_order_mx.rate,
                           sale_order_mx.ratePrice,
                           sale_order_mx.rateAmount,
                           sale_order_mx.pricetype,
                           sale_order_mx.openQty,
                           sale_order_mx.stopQty,
                           sale_order_mx.saleQty,
                           sale_order_mx.warehouseid,
                           sale_order_mx.otherUnit,
                           sale_order_mx.otherUnitConversionRate,
                           sale_order_mx.kz_productCode,
                           sale_order_mx.kz_productName,
                           sale_order_mx.kz_spec,
                           sale_order_mx.kz_materials,
                           sale_order_mx.kz_remark,
                           sale_order_mx.kz_spec_d,
                           sale_order_mx.kz_materials_d,
                           sale_order_mx.remark1,
                           sale_order_mx.remark2,
                           sale_order_mx.remark3,
                           sale_order_mx.remark4,
                           sale_order_mx.remark5,
                           sale_order_mx.lineClose
                         ) VALUES ? 
                         `;
        const [res] = await conn.query<ResultSetHeader>(sql,[saleOrderMxList.map(sale_order_mx => [
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
            sale_order_mx.agio,
            sale_order_mx.agio1,
            sale_order_mx.agio2,
            sale_order_mx.exchangeRate,
            sale_order_mx.rate,
            sale_order_mx.ratePrice,
            sale_order_mx.rateAmount,
            sale_order_mx.pricetype,
            sale_order_mx.openQty,
            sale_order_mx.stopQty,
            sale_order_mx.saleQty,
            sale_order_mx.warehouseid,
            sale_order_mx.otherUnit,
            sale_order_mx.otherUnitConversionRate,
            sale_order_mx.kz_productCode,
            sale_order_mx.kz_productName,
            sale_order_mx.kz_spec,
            sale_order_mx.kz_materials,
            sale_order_mx.kz_remark,
            sale_order_mx.kz_spec_d,
            sale_order_mx.kz_materials_d,
            sale_order_mx.remark1,
            sale_order_mx.remark2,
            sale_order_mx.remark3,
            sale_order_mx.remark4,
            sale_order_mx.remark5,
            sale_order_mx.lineClose
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

    public async salesOrderSale(saleOrderId: number,saleOrderMxId: number, saleQty:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
            UPDATE
                sale_order_mx
            SET
                sale_order_mx.saleQty = ${conn.escape(saleQty)}
            WHERE
                sale_order_mx.saleOrderId = ${conn.escape(saleOrderId)}
                AND sale_order_mx.printid = ${conn.escape(saleOrderMxId)}
        `;
        const [res] = await conn.query<ResultSetHeader>(sql);
        if(res.affectedRows>0){
            return res
        }else{
            return Promise.reject(new Error('更新销售订单销售数量明细失败'));
        }
    }

    public async salesOrderStopSale(saleOrderId: number,saleOrderMxId: number, stopQty:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
            UPDATE
                sale_order_mx
            SET
                sale_order_mx.stopQty = ${conn.escape(stopQty)}
            WHERE
                sale_order_mx.saleOrderId = ${conn.escape(saleOrderId)}
                AND sale_order_mx.printid = ${conn.escape(saleOrderMxId)}
        `;
        const [res] = await conn.query<ResultSetHeader>(sql);
        if(res.affectedRows>0){
            return res
        }else{
            return Promise.reject(new Error('更新销售订单明细终止数量失败'));
        }
    }

    public async lineClose(saleOrderId: number,saleOrderMxId: number,lineClose:boolean){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
            UPDATE
                sale_order_mx
            SET
                sale_order_mx.lineClose = ${conn.escape(lineClose)}
            WHERE
                sale_order_mx.saleOrderId = ${conn.escape(saleOrderId)}
                AND sale_order_mx.printid = ${conn.escape(saleOrderMxId)}
        `;
        const [res] = await conn.query<ResultSetHeader>(sql);
        if(res.affectedRows>0){
            return res
        }else{
            return Promise.reject(new Error('销售订单明细关闭整行失败'));
        }
    }
}