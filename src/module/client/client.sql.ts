import { ResultSetHeader } from "mysql2/promise";
import { Client } from "./client";
import { AddClientDto } from "./dto/addClient.dto";
import { UpdateClientDto } from "./dto/updateClient.dto";
import { Injectable } from "@nestjs/common";
import { SelectClientDto } from "./dto/selectClient.dto";
import { DeleteClientDto } from "./dto/deleteClient.dto";
import { MysqldbAls } from "../mysqldb/mysqldbAls";

@Injectable()
export class ClientSql {
  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  public async getClient(clientid: number): Promise<Client> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM client WHERE del_uuid = 0 AND clientid =?`;
    const [res] = await conn.query(sql, [clientid]);
    if ((res as Client[]).length > 0) {
      return (res as Client[])[0];
    } else {
      return Promise.reject(new Error("找不到这个客户"));
    }
  }

  public async getGsClient(): Promise<Client> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM client WHERE client.del_uuid = 0 AND client.gs = 1`;
    const [res] = await conn.query(sql);
    if ((res as Client[]).length > 0) {
      return (res as Client[])[0];
    } else {
      return Promise.reject(new Error("找不到公司标记客户"));
    }
  }

  public async getClients(client: SelectClientDto): Promise<Client[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    let sql: string = `SELECT * FROM client WHERE del_uuid = 0 AND operateareaid IN (?)`;
    let param = [];
    if (client.operateareaids.length > 0) {
      param.push(client.operateareaids);
    } else {
      param.push([0]);
    }

    if (client.clientareaid) {
      sql = sql + ` AND clientareaid = ?`;
      param.push(client.clientareaid);
    }

    if (client.useflag !== null) {
      sql = sql + ` AND client.useflag = ?`;
      param.push(client.useflag);
    }

    if (client.search) {
      sql = sql + ` AND (clientcode LIKE ? OR clientname LIKE ?)`;
      param.push(`%${client.search}%`, `%${client.search}%`);
    }
    if (client.page !== undefined && client.page !== null && client.pagesize !== undefined && client.pagesize !== null) {
      sql = sql + ` LIMIT ?,?`;
      param.push(client.page, client.pagesize);
    }
    const [res] = await conn.query(sql, param);
    return (res as Client[]);
  }

  public async getDeletedClient(clientid: number): Promise<Client> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM client WHERE del_uuid <> 0 AND clientid =?`;
    const [res] = await conn.query(sql, [clientid]);
    if ((res as Client[]).length > 0) {
      return (res as Client[])[0];
    } else {
      return Promise.reject(new Error("找不到这个已删除客户"));
    }
  }

  public async getDeletedClients(client: SelectClientDto): Promise<Client[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    let sql: string = `SELECT * FROM client WHERE del_uuid <> 0 AND operateareaid IN (?)`;
    let param = [];
    if (client.operateareaids.length > 0) {
      param.push(client.operateareaids);
    } else {
      param.push([0]);
    }

    if (client.clientareaid) {
      sql = sql + ` AND areaid = ?`;
      param.push(client.clientareaid);
    }
    if (client.search) {
      sql = sql + ` AND (clientcode LIKE ? OR clientname LIKE ?)`;
      param.push(`%${client.search}%`, `%${client.search}%`);
    }
    if (client.page !== undefined && client.page !== null && client.pagesize !== undefined && client.pagesize !== null) {
      sql = sql + ` LIMIT ?,?`;
      param.push(client.page, client.pagesize);
    }
    const [res] = await conn.query(sql, param);
    return (res as Client[]);
  }

  public async add(client: AddClientDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `INSERT INTO client SET ?`;
    const [res] = await conn.query(sql, client);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增客户失败"));
    }
  }

  public async update(client: UpdateClientDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE client SET ? WHERE del_uuid = 0 AND clientid = ?`;
    const [res] = await conn.query(sql, [client, client.clientid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("更新客户失败"));
    }
  }

  public async delete_data(client: DeleteClientDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE client SET ? WHERE del_uuid = 0 AND clientid = ?`;
    const [res] = await conn.query(sql, [client, client.clientid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("删除客户失败"));
    }
  }

  public async undelete(client: DeleteClientDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE client SET ? WHERE del_uuid <> 0 AND clientid = ?`;
    const [res] = await conn.query(sql, [client, client.clientid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("取消删除客户失败"));
    }
  }


}