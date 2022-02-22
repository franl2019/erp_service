import { ResultSetHeader } from "mysql2/promise";
import { AddProductAreaDto } from "./dto/addProductArea.dto";
import { UpdateProductAreaDto } from "./dto/updateProductArea.dto";
import { Injectable } from "@nestjs/common";
import { DeleteProductAreaDto } from "./dto/deleteProductArea.dto";
import { ProductArea } from "./productArea";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { Product } from "../product/product";


@Injectable()
export class ProductAreaSql {

  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  //查询产品类别
  public async getProductArea(productareaid: number): Promise<ProductArea> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM productarea WHERE del_uuid = 0 AND productareaid = ?`;
    const [res] = await conn.query(sql, [productareaid]);
    if ((res as ProductArea[]).length > 0) {
      return (res as ProductArea[])[0];
    } else {
      return Promise.reject(new Error("找不到单个产品类别"));
    }

  }

  //查询产品类别
  public async getProductAreas(): Promise<ProductArea[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM productarea WHERE del_uuid = 0`;
    const [res] = await conn.query(sql);
    return (res as ProductArea[]);
  }

  //查询产品类别下的产品资料
  public async getProductBelongsToProductArea(productareaid: number) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM product WHERE del_uuid = 0 AND product.productareaid = ? LIMIT 0,1`;
    const [res] = await conn.query(sql, [productareaid]);
    return (res as Product[]);
  }

  //查询删除产品类别
  public async getDeleteProductArea(productareaid: number): Promise<ProductArea> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM productarea WHERE del_uuid <> 0 AND productareaid = ?`;
    const [res] = await conn.query(sql, [productareaid]);
    if ((res as ProductArea[]).length > 0) {
      return (res as ProductArea[])[0];
    } else {
      return Promise.reject(new Error("找不到已删除单个产品类别"));
    }

  }

  //查询产品类别
  public async getDeleteProductAreas(): Promise<ProductArea[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM productarea WHERE del_uuid <> 0`;
    const [res] = await conn.query(sql);
    return (res as ProductArea[]);
  }

  //获取产品类别下级区域
  public async getChildrenProductArea(parentid: number): Promise<ProductArea[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM productarea WHERE del_uuid = 0 AND parentid = ?`;
    const [res] = await conn.query(sql, [parentid]);
    return (res as ProductArea[]);
  }

  //新增产品类别
  public async add(productArea: AddProductAreaDto) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = "INSERT INTO productarea SET ?";
    const [res] = await conn.query(sql, productArea);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增产品类别失败"));
    }
  }

  //更新产品类别
  public async update(productarea: UpdateProductAreaDto) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE productarea SET ? WHERE productareaid = ?`;
    const [res] = await conn.query(sql, [productarea, productarea.productareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
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
      const productArea_DB = await this.getProductArea(productareaid);
      productArea_DB.sonflag = 0;
      await this.update(productArea_DB);
    } else {
      const productArea_DB = await this.getProductArea(productareaid);
      productArea_DB.sonflag = 1;
      await this.update(productArea_DB);
    }

  }

  //删除产品类别
  public async delete_data(productArea: DeleteProductAreaDto) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE productarea SET ? WHERE productareaid = ?`;
    const [res] = await conn.query(sql, [productArea, productArea.productareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("删除产品类别失败"));
    }
  }

  //取消删除产品类别
  public async undelete(productArea: DeleteProductAreaDto) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE productarea SET ? WHERE productareaid = ? AND del_uuid = ?`;
    const [res] = await conn.query(sql, [productArea, productArea.productareaid, productArea.productareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("取消删除产品类别失败"));
    }
  }
}