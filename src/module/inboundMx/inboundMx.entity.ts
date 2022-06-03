import { Injectable } from "@nestjs/common";
import { ResultSetHeader } from "mysql2/promise";
import { IInboundMx, InboundMx } from "./inboundMx";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { IFindInboundMx } from "./dto/findInboundMx";

@Injectable()
export class InboundMxEntity {

  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  //查找进仓单的明细(带关联)
  public async find(inboundid: number): Promise<IFindInboundMx[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql = `SELECT 
 	              inbound_mx.inboundid, 
                  inbound_mx.printid, 
                  inbound_mx.clientid, 
                  inbound_mx.productid, 
                  inbound_mx.spec_d, 
                  inbound_mx.materials_d, 
                  inbound_mx.remarkmx, 
                  inbound_mx.remark, 
                  inbound_mx.inqty, 
                  inbound_mx.bzqty, 
                  inbound_mx.priceqty, 
                  inbound_mx.price, 
                  inbound_mx.bzprice, 
                  inbound_mx.netprice, 
                  inbound_mx.agio, 
                  inbound_mx.agio1, 
                  inbound_mx.agio2, 
                  inbound_mx.pricetype,
                  client.clientname,
                  product.productcode,
                  product.productname,
                  product.materials,
                  product.spec,
                  product.packqty,
                  product.unit,
                  round(
                    SUM(inbound_mx.priceqty * inbound_mx.netprice),2
                  ) AS amt
                 FROM
                  inbound_mx
                  INNER JOIN client ON inbound_mx.clientid = client.clientid
                  INNER JOIN product ON inbound_mx.productid = product.productid
                 WHERE 
                  inbound_mx.inboundid = ?
                 GROUP BY
	              inbound_mx.inboundid ASC,
	              inbound_mx.printid ASC
	              `;
    const [res] = await conn.query(sql, [inboundid]);
    if ((res as IFindInboundMx[]).length > 0) {
      return (res as IFindInboundMx[]);
    } else {
      return Promise.reject(new Error("找不到进仓单明细"));
    }
  }

  //查找进仓单的明细(无关联，纯实例)
  public async findById(inboundId: number): Promise<InboundMx[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql = `SELECT 
 	              inbound_mx.inboundid, 
                  inbound_mx.printid, 
                  inbound_mx.clientid, 
                  inbound_mx.productid, 
                  inbound_mx.spec_d, 
                  inbound_mx.materials_d, 
                  inbound_mx.remarkmx, 
                  inbound_mx.remark, 
                  inbound_mx.inqty, 
                  inbound_mx.bzqty, 
                  inbound_mx.priceqty, 
                  inbound_mx.price, 
                  inbound_mx.bzprice, 
                  inbound_mx.netprice, 
                  inbound_mx.agio, 
                  inbound_mx.agio1, 
                  inbound_mx.agio2, 
                  inbound_mx.pricetype
                 FROM 
                  inbound_mx 
                 WHERE 
                  inbound_mx.inboundid = ?`;
    const [res] = await conn.query(sql, [inboundId]);
    if ((res as InboundMx[]).length > 0) {
      return (res as InboundMx[]);
    } else {
      return Promise.reject(new Error("找不到进仓单明细"));
    }
  }

  //创建进仓单的明细
  public async create(inboundMxList: IInboundMx[]) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql = `INSERT INTO inbound_mx (
                  inbound_mx.inboundid, 
                  inbound_mx.printid, 
                  inbound_mx.clientid, 
                  inbound_mx.productid, 
                  inbound_mx.spec_d, 
                  inbound_mx.materials_d, 
                  inbound_mx.remarkmx, 
                  inbound_mx.remark, 
                  inbound_mx.inqty, 
                  inbound_mx.bzqty, 
                  inbound_mx.priceqty, 
                  inbound_mx.price, 
                  inbound_mx.bzprice, 
                  inbound_mx.netprice, 
                  inbound_mx.agio, 
                  inbound_mx.agio1, 
                  inbound_mx.agio2, 
                  inbound_mx.pricetype
                 ) VALUES ?`;

    const [res] = await conn.query<ResultSetHeader>(sql,
      [inboundMxList.map(inbound_mx => [
        inbound_mx.inboundid,
        inbound_mx.printid,
        inbound_mx.clientid,
        inbound_mx.productid,
        inbound_mx.spec_d,
        inbound_mx.materials_d,
        inbound_mx.remarkmx,
        inbound_mx.remark,
        inbound_mx.inqty,
        inbound_mx.bzqty,
        inbound_mx.priceqty,
        inbound_mx.price,
        inbound_mx.bzprice,
        inbound_mx.netprice,
        inbound_mx.agio,
        inbound_mx.agio1,
        inbound_mx.agio2,
        inbound_mx.pricetype
      ])]);

    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("进仓单插入明细失败"));
    }
  }

  public async delete_data(inboundid: number) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql = `DELETE FROM inbound_mx WHERE inbound_mx.inboundid = ?`;
    const [res] = await conn.query<ResultSetHeader>(sql, [inboundid]);
    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("进仓单删除明细失败"));
    }
  }
}