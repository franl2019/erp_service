import { ResultSetHeader } from "mysql2/promise";
import { IWarehouse } from "./warehouse";
import { AddWarehouseDto } from "./dto/addWarehouse.dto";
import { DeleteWarehouseDto } from "./dto/deleteWarehouse.dto";
import { UpdateWarehouseDto } from "./dto/updateWarehouse.dto";
import { Injectable } from "@nestjs/common";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import {IProduct} from "../product/product";
import { SelectWarehouse_authDto } from "./dto/selectWarehouse_auth.dto";

@Injectable()
export class WarehouseSql {

  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  public async findOne(warehouseid: number): Promise<IWarehouse> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM warehouse WHERE warehouse.warehouseid = ? AND warehouse.del_uuid = 0`;
    const [res] = await conn.query(sql, [warehouseid]);
    if ((res as IWarehouse[]).length > 0) {
      return (res as IWarehouse[])[0];
    } else {
      return Promise.reject(new Error("找不到这个仓库资料"));
    }
  }

  public async getWarehouses(): Promise<IWarehouse[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT warehouse.warehouseid,warehouse.warehousename,warehouse.warehousecode,warehouse.warehousetype, warehouse.useflag, warehouse.creater, 
                                warehouse.createdAt, warehouse.updater, warehouse.updatedAt, warehouse.del_uuid, warehouse.deletedAt, warehouse.deleter 
                                FROM warehouse WHERE warehouse.del_uuid = 0`;
    const [res] = await conn.query(sql);
    return (res as IWarehouse[]);
  }

  public async getWarehouses_auth(selectAuthDto:SelectWarehouse_authDto): Promise<IWarehouse[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT warehouse.warehouseid,warehouse.warehousename,warehouse.warehousecode,warehouse.warehousetype, warehouse.useflag, warehouse.creater, 
                                warehouse.createdAt, warehouse.updater, warehouse.updatedAt, warehouse.del_uuid, warehouse.deletedAt, warehouse.deleter 
                         FROM warehouse INNER JOIN user_warehousemx ON warehouse.warehouseid = user_warehousemx.warehouseid
                         WHERE warehouse.del_uuid = 0 AND user_warehousemx.userid = ?`;
    const [res] = await conn.query(sql,[selectAuthDto.userid]);
    return (res as IWarehouse[]);
  }

  public async getWarehouse_auth_default(selectAuthDto:SelectWarehouse_authDto): Promise<IWarehouse[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT warehouse.warehouseid,warehouse.warehousename,warehouse.warehousecode,warehouse.warehousetype, warehouse.useflag, warehouse.creater, 
                                warehouse.createdAt, warehouse.updater, warehouse.updatedAt, warehouse.del_uuid, warehouse.deletedAt, warehouse.deleter
                         FROM warehouse INNER JOIN user_warehousemx ON warehouse.warehouseid = user_warehousemx.warehouseid
                         WHERE warehouse.del_uuid = 0 AND user_warehousemx.userid = ? AND user_warehousemx.default = 1`;
    const [res] = await conn.query(sql,[selectAuthDto.userid]);
    return (res as IWarehouse[]);
  }

  public async getProductBelongToWarehouse(warehouseid: number) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM product WHERE product.del_uuid = 0 AND product.warehouseid = ? LIMIT 0,1`;
    const [res] = await conn.query(sql, [warehouseid]);
    return (res as IProduct[]);
  }

  public async getDeletedWarehouse(warehouseid: number): Promise<IWarehouse> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM warehouse WHERE del_uuid <> 0 AND warehouseid = ?`;
    const [res] = await conn.query(sql, [warehouseid]);
    if ((res as IWarehouse[]).length > 0) {
      return (res as IWarehouse[])[0];
    } else {
      return Promise.reject(new Error("找不到单个已删除的仓库"));
    }
  }

  public async getDeletedWarehouses(): Promise<IWarehouse[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM warehouse WHERE del_uuid <> 0`;
    const [res] = await conn.query(sql);
    return (res as IWarehouse[]);
  }

  public async add(addDto: AddWarehouseDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `INSERT INTO warehouse SET ?`;
    const [res] = await conn.query(sql, [addDto]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增仓库失败"));
    }
  }

  public async update(updateDto: UpdateWarehouseDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE warehouse SET ? WHERE warehouseid =?`;
    const [res] = await conn.query(sql, [updateDto, updateDto.warehouseid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("更新仓库失败"));
    }
  }

  public async delete_data(deleteDto: DeleteWarehouseDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE warehouse SET ? WHERE del_uuid = 0 AND warehouseid =?`;
    const [res] = await conn.query(sql, [deleteDto, deleteDto.warehouseid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("删除仓库失败"));
    }
  }

  public async undelete(deleteDto: DeleteWarehouseDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE warehouse SET ? WHERE del_uuid <> 0 AND warehouseid =?`;
    const [res] = await conn.query(sql, [deleteDto, deleteDto.warehouseid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("取消删除仓库失败"));
    }
  }
}