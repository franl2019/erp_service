import { ResultSetHeader } from "mysql2/promise";
import { Product } from "./product";
import { SelectProductDto } from "./dto/selectProduct.dto";
import { AddProductDto } from "./dto/addProduct.dto";
import { UpdateProductDto } from "./dto/updateProduct.dto";
import { DeleteProductDto } from "./dto/deleteProduct.dto";
import { Injectable } from "@nestjs/common";
import { MysqldbAls } from "../mysqldb/mysqldbAls";

@Injectable()
export class ProductSql {
  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  public async getProduct(productid: number): Promise<Product> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM product WHERE del_uuid = 0 AND productid =?`;
    const [res] = await conn.query(sql, [productid]);
    if ((res as Product[]).length > 0) {
      return (res as Product[])[0];
    } else {
      return Promise.reject(new Error("找不到单个产品资料"));
    }
  }

  public async getProducts(product: SelectProductDto): Promise<Product[]> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    let sql: string = `SELECT * FROM product WHERE del_uuid = 0 AND warehouseid in (?)`;
    let param = [];

    if (product.warehouseids.length > 0) {
      param.push(product.warehouseids);
    } else {
      param.push([0]);
    }

    if (product.productareaid && product.productareaid !== 0) {
      sql = sql + ` AND productareaid = ?`;
      param.push(product.productareaid);
    }

    if (product.useflag!==null) {
      sql = sql + ` AND product.useflag = ?`;
      param.push(product.useflag);
    }

    if (product.search) {
      sql = sql + ` AND (productcode LIKE ? OR productname LIKE ?)`;
      param.push(`%${product.search}%`, `%${product.search}%`);
    }

    if (product.page !== undefined && product.page !== null && product.pagesize !== undefined && product.pagesize !== null) {
      sql = sql + ` LIMIT ?,?`;
      param.push(product.page, product.pagesize);
    }
    const [res] = await conn.query(sql, param);
    return (res as Product[]);
  }

  public async getDeletedProduct(productid: number): Promise<Product> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM product WHERE del_uuid <> 0 AND productid =?`;
    const [res] = await conn.query(sql, [productid]);
    if ((res as Product[]).length > 0) {
      return (res as Product[])[0];
    } else {
      return Promise.reject(new Error("查无此已删产品资料"));
    }
  }

  public async getDeletedProducts(product: SelectProductDto): Promise<Product[]> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    let sql: string = `SELECT * FROM product WHERE del_uuid <> 0 AND warehouseid = ?`;
    let param = [];

    //仓库权限
    if (product.warehouseids.length > 0) {
      param.push(product.warehouseids);
    } else {
      param.push([0]);
    }

    //产品类别
    if (product.productareaid && product.productareaid !== 0) {
      sql = sql + ` AND productareaid = ?`;
      param.push(product.productareaid);
    }

    //产品关键词查询
    if (product.search) {
      sql = sql + ` AND (productcode LIKE ? OR productname LIKE ?)`;
      param.push(`%${product.search}%`, `%${product.search}%`);
    }
    if (product.page !== undefined && product.page !== null && product.pagesize !== undefined && product.pagesize !== null) {
      sql = sql + ` LIMIT ?,?`;
      param.push(product.page, product.pagesize);
    }
    const [res] = await conn.query(sql, param);
    return (res as Product[]);
  }

  public async add(product: AddProductDto): Promise<ResultSetHeader> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `INSERT INTO product SET ?`;
    const [res] = await conn.query(sql, product);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增产品资料失败"));
    }
  }

  public async update(product: UpdateProductDto): Promise<ResultSetHeader> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE product SET ? WHERE productid = ?`;
    const [res] = await conn.query(sql, [product, product.productid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("更新产品资料失败"));
    }
  }


  public async delete_data(product: DeleteProductDto): Promise<ResultSetHeader> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE product SET ? WHERE productid = ?`;
    const [res] = await conn.query(sql, [product, product.productid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("删除产品资料失败"));
    }
  }

  public async undelete(product: DeleteProductDto): Promise<ResultSetHeader> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE product SET ? WHERE del_uuid = ? AND productid = ?`;
    const [res] = await conn.query(sql, [product, product.productid, product.productid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("取消删除产品资料失败"));
    }
  }
}