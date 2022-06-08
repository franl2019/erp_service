import { ResultSetHeader } from "mysql2/promise";
import { AddProductAreaDto } from "./dto/addProductArea.dto";
import { UpdateProductAreaDto } from "./dto/updateProductArea.dto";
import { Injectable } from "@nestjs/common";
import {IProductArea} from "./productArea";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import {IProduct} from "../product/product";


@Injectable()
export class ProductAreaSql {

  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  //查询产品类别
  public async findOne(productareaid: number): Promise<IProductArea> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT 
                            productarea.productareaid,
                            productarea.productareacode,
                            productarea.productareaname,
                            productarea.sonflag,
                            productarea.parentid,
                            productarea.parentCode,
                            productarea.creater,
                            productarea.createdAt,
                            productarea.updater,
                            productarea.updatedAt,
                            productarea.del_uuid,
                            productarea.deletedAt,
                            productarea.deleter
                        FROM 
                            productarea 
                        WHERE 
                            productarea.del_uuid = 0 
                            AND productarea.productareaid = ?`;
    const [res] = await conn.query(sql, [productareaid]);
    if ((res as IProductArea[]).length > 0) {
      return (res as IProductArea[])[0];
    } else {
      return Promise.reject(new Error("找不到单个产品类别"));
    }

  }

  //查询产品类别
  public async find(): Promise<IProductArea[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT 
                            productarea.productareaid,
                            productarea.productareacode,
                            productarea.productareaname,
                            productarea.sonflag,
                            productarea.parentid,
                            productarea.parentCode,
                            productarea.creater,
                            productarea.createdAt,
                            productarea.updater,
                            productarea.updatedAt,
                            productarea.del_uuid,
                            productarea.deletedAt,
                            productarea.deleter
                         FROM 
                            productarea
                         WHERE
                            productarea.del_uuid = 0`;
    const [res] = await conn.query(sql);
    return (res as IProductArea[]);
  }

  //查询产品类别下的产品资料
  public async getProductBelongsToProductArea(productareaid: number) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM product WHERE del_uuid = 0 AND product.productareaid = ? LIMIT 0,1`;
    const [res] = await conn.query(sql, [productareaid]);
    return (res as IProduct[]);
  }

  //查询产品类别
  public async getDeleteProductAreas(): Promise<IProductArea[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM productarea WHERE del_uuid <> 0`;
    const [res] = await conn.query(sql);
    return (res as IProductArea[]);
  }

  //获取产品类别下级区域
  public async getChildrenProductArea(parentid: number): Promise<IProductArea[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM productarea WHERE del_uuid = 0 AND parentid = ?`;
    const [res] = await conn.query(sql, [parentid]);
    return (res as IProductArea[]);
  }

  //新增产品类别
  public async create(productArea: AddProductAreaDto) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `INSERT INTO productarea (
                            productarea.productareaid,
                            productarea.productareacode,
                            productarea.productareaname,
                            productarea.sonflag,
                            productarea.parentid,
                            productarea.parentCode,
                            productarea.creater,
                            productarea.createdAt
                        ) VALUES ?`;
    const [res] = await conn.query<ResultSetHeader>(sql, [[[
      productArea.productareaid,
      productArea.productareacode,
      productArea.productareaname,
      productArea.sonflag,
      productArea.parentid,
      productArea.parentCode,
      productArea.creater,
      productArea.createdAt
    ]]]);
    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("新增产品类别失败"));
    }
  }

  //更新产品类别
  public async update(productarea: UpdateProductAreaDto) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE
                            productarea
                         SET 
                            productarea.productareacode = ?,
                            productarea.productareaname = ?,
                            productarea.sonflag = ?,
                            productarea.parentid = ?,
                            productarea.parentCode = ?,
                            productarea.updater = ?,
                            productarea.updatedAt = ?
                         WHERE 
                            productarea.productareaid = ?`;
    const [res] = await conn.query<ResultSetHeader>(sql, [
      productarea.productareacode,
      productarea.productareaname,
      productarea.sonflag,
      productarea.parentid,
      productarea.parentCode,
      productarea.updater,
      productarea.updatedAt,
      productarea.productareaid
    ]);
    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("更新产品类别失败"));
    }
  }

  //更新产品类别sonflag标记
  public async updateSonflag(productareaid: number) {
    //获取下级类别
    const childrenList = await this.getChildrenProductArea(productareaid);
    //如果没有下级类别更新sonflag = 0
    if (childrenList.length === 0) {
      const productArea_DB = await this.findOne(productareaid);
      productArea_DB.sonflag = 0;
      await this.update(productArea_DB);
    } else {
      const productArea_DB = await this.findOne(productareaid);
      productArea_DB.sonflag = 1;
      await this.update(productArea_DB);
    }
  }

  //删除产品类别
  public async delete_data(productareaid: number,userName:string) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE 
                            productarea
                         SET 
                            productarea.del_uuid = ?,
                            productarea.deleter = ?,
                            productarea.deletedAt = ?
                         WHERE
                            productareaid = ?`;
    const [res] = await conn.query<ResultSetHeader>(sql, [
      productareaid,
      userName,
      new Date(),
      productareaid
    ]);
    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("删除产品类别失败"));
    }
  }
}