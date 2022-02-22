import { Injectable } from "@nestjs/common";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { IOutbound_mx } from "./outbound_mx";
import { ResultSetHeader } from "mysql2/promise";
import { IFindOutboundMx } from "./findOutbound_mx";

@Injectable()
export class Outbound_mxEntity {

  constructor(
    private readonly mysqldbAls: MysqldbAls
  ) {
  }

  //查询出仓单明细,带关联信息
  public async find(outboundid: number): Promise<IFindOutboundMx[]> {
    const conn = this.mysqldbAls.getConnectionInAls();
    const sql = `SELECT
                    outbound_mx.outboundid, 
                    outbound_mx.printid, 
                    outbound_mx.inventoryid, 
                    outbound_mx.productid, 
                    outbound_mx.spec_d, 
                    outbound_mx.materials_d, 
                    outbound_mx.remarkmx, 
                    outbound_mx.remark, 
                    outbound_mx.outqty, 
                    outbound_mx.bzqty, 
                    outbound_mx.price, 
                    outbound_mx.bzprice, 
                    outbound_mx.priceqty, 
                    SUM(outbound_mx.netprice * outbound_mx.priceqty) AS amt,
                    outbound_mx.netprice, 
                    outbound_mx.floatprice1, 
                    outbound_mx.floatprice2, 
                    outbound_mx.floatprice3, 
                    outbound_mx.agio, 
                    outbound_mx.agio1, 
                    outbound_mx.agio2, 
                    outbound_mx.pricetype, 
                    outbound_mx.clientid,
                    outbound_mx.warehouseid,
                    warehouse.warehousename,
                    client.clientname,
                    product.productcode,
                    product.productname,
                    product.materials,
                    product.spec,
                    product.packqty,
                    product.unit
                FROM
                   outbound_mx
                   INNER JOIN client ON outbound_mx.clientid = client.clientid
                   INNER JOIN product ON outbound_mx.productid = product.productid
                   INNER JOIN warehouse ON outbound_mx.warehouseid = warehouse.warehouseid
                WHERE
                   outbound_mx.outboundid = ?
                GROUP BY
                   outbound_mx.outboundid, 
                   outbound_mx.printid`;
    const [rows] = await conn.query(sql, [outboundid]);
    if ((rows as IFindOutboundMx[]).length > 0) {
      return rows as IFindOutboundMx[];
    } else {
      return Promise.reject(new Error("查找出仓单的明细错误"));
    }
  }

  //查找出仓单明细(实例)
  public async find_entity(outboundid: number): Promise<IOutbound_mx[]> {
    const conn = this.mysqldbAls.getConnectionInAls();
    const sql = `SELECT
                outbound_mx.outboundid, 
                outbound_mx.printid, 
                outbound_mx.inventoryid, 
                outbound_mx.productid, 
                outbound_mx.spec_d, 
                outbound_mx.materials_d, 
                outbound_mx.remarkmx, 
                outbound_mx.remark, 
                outbound_mx.outqty, 
                outbound_mx.bzqty, 
                outbound_mx.priceqty, 
                outbound_mx.price, 
                outbound_mx.bzprice, 
                outbound_mx.netprice, 
                outbound_mx.floatprice1, 
                outbound_mx.floatprice2, 
                outbound_mx.floatprice3, 
                outbound_mx.agio, 
                outbound_mx.agio1, 
                outbound_mx.agio2, 
                outbound_mx.pricetype, 
                outbound_mx.clientid,
                outbound_mx.warehouseid
               FROM
                outbound_mx
               WHERE
                outbound_mx.outboundid = ?`;
    const [rows] = await conn.query(sql, [outboundid]);
    if ((rows as IOutbound_mx[]).length > 0) {
      return rows as IOutbound_mx[];
    } else {
      return Promise.reject(new Error("查找出仓单的明细错误"));
    }
  }

  //增加出仓单明细
  public async create(outboundMxList: IOutbound_mx[]) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql = `INSERT INTO outbound_mx (
                  outbound_mx.outboundid, 
                  outbound_mx.printid, 
                  outbound_mx.inventoryid, 
                  outbound_mx.productid, 
                  outbound_mx.spec_d, 
                  outbound_mx.materials_d, 
                  outbound_mx.remarkmx, 
                  outbound_mx.remark, 
                  outbound_mx.outqty, 
                  outbound_mx.bzqty, 
                  outbound_mx.priceqty, 
                  outbound_mx.price, 
                  outbound_mx.bzprice, 
                  outbound_mx.netprice, 
                  outbound_mx.floatprice1, 
                  outbound_mx.floatprice2, 
                  outbound_mx.floatprice3, 
                  outbound_mx.agio, 
                  outbound_mx.agio1, 
                  outbound_mx.agio2, 
                  outbound_mx.pricetype, 
                  outbound_mx.clientid,
                  outbound_mx.warehouseid
                 ) VALUES ?`;
    const [res] = await conn.query<ResultSetHeader>(sql,
      [outboundMxList.map(outbound_mx => [
        outbound_mx.outboundid,
        outbound_mx.printid,
        outbound_mx.inventoryid,
        outbound_mx.productid,
        outbound_mx.spec_d,
        outbound_mx.materials_d,
        outbound_mx.remarkmx,
        outbound_mx.remark,
        outbound_mx.outqty,
        outbound_mx.bzqty,
        outbound_mx.priceqty,
        outbound_mx.price,
        outbound_mx.bzprice,
        outbound_mx.netprice,
        outbound_mx.floatprice1,
        outbound_mx.floatprice2,
        outbound_mx.floatprice3,
        outbound_mx.agio,
        outbound_mx.agio1,
        outbound_mx.agio2,
        outbound_mx.pricetype,
        outbound_mx.clientid,
        outbound_mx.warehouseid,
      ])]
    );

    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("增加出仓单明细错误"));
    }
  }

  //删除出仓单明细
  public async delete_data(outboundid: number) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql = `DELETE FROM outbound_mx WHERE outbound_mx.outboundid = ?`;
    const [res] = await conn.query<ResultSetHeader>(sql, [outboundid]);
    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("删除出仓单明细失败"));
    }
  }
}