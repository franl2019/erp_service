import { ResultSetHeader } from "mysql2/promise";
import { AddClientAreaDto } from "./dto/addClientArea.dto";
import { UpdateClientAreaDto } from "./dto/updateClientArea.dto";
import { Injectable } from "@nestjs/common";
import { DeleteClientAreaDto } from "./dto/deleteClientArea.dto";
import { ClientArea } from "./clientArea";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { Client } from "../client/client";

@Injectable()
export class ClientAreaSql {
  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  //查询客户地区
  public async getClientArea(clientareaid: number): Promise<ClientArea> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM clientarea WHERE del_uuid = 0 AND clientareaid = ?`;
    const [res] = await conn.query(sql, [clientareaid]);
    if ((res as ClientArea[]).length > 0) {
      return (res as ClientArea[])[0];
    } else {
      return Promise.reject(new Error("找不到单个客户地区"));
    }

  }

  //查询客户地区
  public async getClientAreas(): Promise<ClientArea[]> {
    const conn = this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM clientarea WHERE del_uuid = 0`;
    const [res] = await conn.query(sql);
    return (res as ClientArea[]);
  }

  //查询删除客户地区
  public async getDeleteClientArea(clientareaid: number): Promise<ClientArea> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM clientarea WHERE del_uuid <> 0 AND clientareaid = ?`;
    const [res] = await conn.query(sql, [clientareaid]);
    if ((res as ClientArea[]).length > 0) {
      return (res as ClientArea[])[0];
    } else {
      return Promise.reject(new Error("找不到已删除单个客户地区"));
    }

  }

  //查询客户地区
  public async getDeleteClientAreas(): Promise<ClientArea[]> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM clientarea WHERE del_uuid <> 0`;
    const [res] = await conn.query(sql);
    return (res as ClientArea[]);
  }

  //获取客户地区下级区域
  public async getChildrenClientArea(parentid: number): Promise<ClientArea[]> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM clientarea WHERE del_uuid = 0 AND parentid = ?`;
    const [res] = await conn.query(sql, [parentid]);
    return (res as ClientArea[]);
  }

  public async getClientBelongsToClientArea(clientareaid:number):Promise<Client[]>{
    if (clientareaid) {
      const conn =  await this.mysqldbAls.getConnectionInAls();
      let sql: string = `SELECT * FROM client WHERE del_uuid = 0 AND clientareaid = ?  LIMIT 0,1`;
      let param = [clientareaid];
      const [res] = await conn.query(sql, param);
      return (res as Client[]);
    }
  }

  //新增客户地区
  public async add(clientArea: AddClientAreaDto) {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = "INSERT INTO clientarea SET ?";
    const [res] = await conn.query(sql, clientArea);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增客户地区失败"));
    }
  }

  //更新客户地区
  public async update(clientarea: UpdateClientAreaDto) {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE clientarea SET ? WHERE clientareaid = ?`;
    const [res] = await conn.query(sql, [clientarea, clientarea.clientareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("更新客户地区失败"));
    }
  }

  //更新客户地区sonflag标记
  public async updateSonflag(clientareaid: number) {
    //获取下级地区
    const childrenList = await this.getChildrenClientArea(clientareaid);
    //如果没有下级地区更新sonflag = 0
    if (childrenList.length === 0) {
      const clientArea_DB = await this.getClientArea(clientareaid);
      clientArea_DB.sonflag = 0;
      await this.update(clientArea_DB);
    } else {
      const clientArea_DB = await this.getClientArea(clientareaid);
      clientArea_DB.sonflag = 1;
      await this.update(clientArea_DB);
    }

  }

  //删除客户地区
  public async delete_data(clientArea: DeleteClientAreaDto) {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE clientarea SET ? WHERE clientareaid = ?`;
    const [res] = await conn.query(sql, [clientArea, clientArea.clientareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("删除客户地区失败"));
    }
  }

  //取消删除客户地区
  public async undelete(clientArea: DeleteClientAreaDto) {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE clientarea SET ? WHERE clientareaid = ? AND del_uuid = ?`;
    const [res] = await conn.query(sql, [clientArea, clientArea.clientareaid, clientArea.clientareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("取消删除客户地区失败"));
    }
  }
}