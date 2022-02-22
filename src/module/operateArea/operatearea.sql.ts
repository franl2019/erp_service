import { ResultSetHeader } from "mysql2/promise";
import { OperateArea } from "./operatearea";
import { AddOperateAreaDto } from "./dto/addOperateArea.dto";
import { DeleteOperateAreaDto } from "./dto/deleteOperateArea.dto";
import { UpdateOperateAreaDto } from "./dto/updateOperateArea.dto";
import { Injectable } from "@nestjs/common";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { SelectOperateAreaDto } from "./dto/selectOperateArea.dto";

@Injectable()
export class OperateareaSql {

  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  //获取单个操作区域
  public async getOperateArea(operateareaid: number): Promise<OperateArea> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT 
                           operatearea.operateareaid, 
                           operatearea.operateareaname, 
                           operatearea.operateareatype, 
                           operatearea.useflag, 
                           operatearea.creater, 
                           operatearea.createdAt, 
                           operatearea.updater, 
                           operatearea.updatedAt, 
                           operatearea.del_uuid, 
                           operatearea.deletedAt, 
                           operatearea.deleter
                         FROM 
                            operatearea 
                         WHERE 
                           operatearea.operateareaid = ? 
                           AND operatearea.del_uuid = 0`;
    const [res] = await conn.query(sql, [operateareaid]);
    if ((res as OperateArea[]).length > 0) {
      return (res as OperateArea[])[0];
    } else {
      return Promise.reject(new Error("找不到单个操作区域"));
    }
  }

  //获取多个操作区域
  public async getOperateAreas(selectDto: SelectOperateAreaDto): Promise<OperateArea[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT 
                           operatearea.operateareaid, 
                           operatearea.operateareaname, 
                           operatearea.operateareatype, 
                           operatearea.useflag, 
                           operatearea.creater, 
                           operatearea.createdAt, 
                           operatearea.updater, 
                           operatearea.updatedAt, 
                           operatearea.del_uuid, 
                           operatearea.deletedAt, 
                           operatearea.deleter
                         FROM 
                            operatearea 
                         WHERE 
                           operatearea.del_uuid = 0 
                           AND operatearea.useflag = 1 
                           AND operatearea.operateareatype = ?`;
    const param = [selectDto.operateareatype];
    const [res] = await conn.query(sql, param);
    return (res as OperateArea[]);
  }

  //获取公司操作区域(客户公共区域)
  public async getClientPublicOperateArea(): Promise<OperateArea> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT 
                           operatearea.operateareaid, 
                           operatearea.operateareaname, 
                           operatearea.operateareatype, 
                           operatearea.useflag, 
                           operatearea.creater, 
                           operatearea.createdAt, 
                           operatearea.updater, 
                           operatearea.updatedAt, 
                           operatearea.del_uuid, 
                           operatearea.deletedAt, 
                           operatearea.deleter
                         FROM 
                            operatearea 
                         WHERE operatearea.operateareaid = 1 
                           AND operatearea.operateareaname = '公司' 
                           AND operatearea.del_uuid = 0 
                           AND operatearea.useflag = 1 
                           AND operatearea.operateareatype = 0`;
    const [res] = await conn.query(sql);
    if ((res as OperateArea[]).length > 0) {
      return (res[0] as OperateArea);
    } else {
      return Promise.reject(new Error("找不到公司公共操作区域"));
    }
  }

  //获取供应商操作区域(供应商公共区域)
  public async getBuyPublicOperateArea(): Promise<OperateArea> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT 
                           operatearea.operateareaid, 
                           operatearea.operateareaname, 
                           operatearea.operateareatype, 
                           operatearea.useflag, 
                           operatearea.creater, 
                           operatearea.createdAt, 
                           operatearea.updater, 
                           operatearea.updatedAt, 
                           operatearea.del_uuid, 
                           operatearea.deletedAt, 
                           operatearea.deleter
                         FROM 
                            operatearea 
                         WHERE operatearea.operateareaid = 2 
                           AND operatearea.operateareaname = '供应商' 
                           AND operatearea.del_uuid = 0 
                           AND operatearea.useflag = 1 
                           AND operatearea.operateareatype = 1`;
    const [res] = await conn.query(sql);
    if ((res as OperateArea[]).length > 0) {
      return (res[0] as OperateArea);
    } else {
      return Promise.reject(new Error("找不到供应商公共操作区域"));
    }
  }


  //获取单个已删除的操作区域
  public async getDeletedOperateArea(operateareaid: number): Promise<OperateArea> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM operatearea WHERE del_uuid <> 0 AND operateareaid = ?`;
    const [res] = await conn.query(sql, [operateareaid]);
    if ((res as OperateArea[]).length > 0) {
      return (res as OperateArea[])[0];
    } else {
      return Promise.reject(new Error("找不到单个已删除的操作区域"));
    }
  }

  //获取多个已删除的操作区域
  public async getDeletedOperateAreas(): Promise<OperateArea[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM operatearea WHERE del_uuid <> 0`;
    const [res] = await conn.query(sql);
    return (res as OperateArea[]);
  }

  //插入新操作区域
  public async add(addDto: AddOperateAreaDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `INSERT INTO operatearea SET ?`;
    const [res] = await conn.query(sql, [addDto]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增操作区域失败"));
    }
  }

  //更新操作区域资料
  public async update(updateDto: UpdateOperateAreaDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE operatearea SET ? WHERE operateareaid =?`;
    const [res] = await conn.query(sql, [updateDto, updateDto.operateareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("更新操作区域失败"));
    }
  }

  //删除操作区域
  public async delete_data(deleteDto: DeleteOperateAreaDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE operatearea SET ? WHERE operateareaid =?`;
    const [res] = await conn.query(sql, [deleteDto, deleteDto.operateareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("删除操作区域失败"));
    }
  }

  //取消删除操作区域
  public async undelete(deleteDto: DeleteOperateAreaDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE operatearea SET ? WHERE operateareaid =? AND del_uuid <> 0`;
    const [res] = await conn.query(sql, [deleteDto, deleteDto.operateareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("取消删除操作区域失败"));
    }
  }
}