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
                           sale_order_mx.remark5
                    from 
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
                           sale_order_mx.remark5
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
            sale_order_mx.remark5
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