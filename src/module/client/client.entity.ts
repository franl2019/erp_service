import {ResultSetHeader} from "mysql2/promise";
import {IClient} from "./client";
import {AddClientDto} from "./dto/addClient.dto";
import {UpdateClientDto} from "./dto/updateClient.dto";
import {Injectable} from "@nestjs/common";
import {SelectClientDto} from "./dto/selectClient.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable()
export class ClientEntity {
    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async findOne(clientid: number): Promise<IClient> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                            client.clientid,
                            client.clientcode,
                            client.clientname,
                            client.contactperson,
                            client.salesman,
                            client.ymrep,
                            client.phone_no,
                            client.tel_no,
                            client.email,
                            client.address,
                            client.discount,
                            client.moneytype,
                            client.useflag,
                            client.level1review,
                            client.level1name,
                            client.level1date,
                            client.level2review,
                            client.level2name,
                            client.level2date,
                            client.remark1,
                            client.remark2,
                            client.remark3,
                            client.remark4,
                            client.remark5,
                            client.remark6,
                            client.remark7,
                            client.remark8,
                            client.remark9,
                            client.remark10,
                            client.creater,
                            client.createdAt,
                            client.updater,
                            client.updatedAt,
                            client.clientareaid,
                            client.operateareaid,
                            client.currencyid,
                            client.del_uuid,
                            client.deletedAt,
                            client.deleter,
                            client.gs
                         FROM 
                            client 
                         WHERE 
                            client.del_uuid = 0 
                            AND client.clientid = ?`;
        const [res] = await conn.query(sql, [clientid]);
        if ((res as IClient[]).length > 0) {
            return (res as IClient[])[0];
        } else {
            return Promise.reject(new Error("找不到客户资料"));
        }
    }

    public async getGsClient(): Promise<IClient> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                            client.clientid,
                            client.clientcode,
                            client.clientname,
                            client.contactperson,
                            client.salesman,
                            client.ymrep,
                            client.phone_no,
                            client.tel_no,
                            client.email,
                            client.address,
                            client.discount,
                            client.moneytype,
                            client.useflag,
                            client.level1review,
                            client.level1name,
                            client.level1date,
                            client.level2review,
                            client.level2name,
                            client.level2date,
                            client.remark1,
                            client.remark2,
                            client.remark3,
                            client.remark4,
                            client.remark5,
                            client.remark6,
                            client.remark7,
                            client.remark8,
                            client.remark9,
                            client.remark10,
                            client.creater,
                            client.createdAt,
                            client.updater,
                            client.updatedAt,
                            client.clientareaid,
                            client.operateareaid,
                            client.currencyid,
                            client.del_uuid,
                            client.deletedAt,
                            client.deleter,
                            client.gs
                         FROM 
                            client 
                         WHERE 
                            client.del_uuid = 0 
                            AND client.gs = 1`;
        const [res] = await conn.query(sql);
        return (res as IClient[])[0];
    }

    public async find(client: SelectClientDto): Promise<IClient[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql: string = `SELECT 
                          client.clientid,
                          client.clientcode,
                          client.clientname,
                          client.contactperson,
                          client.salesman,
                          client.ymrep,
                          client.phone_no,
                          client.tel_no,
                          client.email,
                          client.address,
                          client.discount,
                          client.moneytype,
                          client.useflag,
                          client.level1review,
                          client.level1name,
                          client.level1date,
                          client.level2review,
                          client.level2name,
                          client.level2date,
                          client.remark1,
                          client.remark2,
                          client.remark3,
                          client.remark4,
                          client.remark5,
                          client.remark6,
                          client.remark7,
                          client.remark8,
                          client.remark9,
                          client.remark10,
                          client.creater,
                          client.createdAt,
                          client.updater,
                          client.updatedAt,
                          client.clientareaid,
                          client.operateareaid,
                          client.currencyid,
                          client.del_uuid,
                          client.deletedAt,
                          client.deleter,
                          client.gs
                        FROM 
                          client 
                        WHERE 
                          client.del_uuid = 0`;
        let param = [];
        if (client.operateareaids.length > 0) {
            sql = sql + ` AND operateareaid IN (?)`
            param.push(client.operateareaids);
        } else {
            sql = sql + ` AND operateareaid IN (?)`
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

        if (client.page && client.pagesize) {
            sql = sql + ` LIMIT ?,?`;
            param.push(client.page, client.pagesize);
        }
        const [res] = await conn.query(sql, param);
        return (res as IClient[]);
    }

    public async create(client: AddClientDto): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `INSERT INTO client (
                              client.clientcode,
                              client.clientname,
                              client.contactperson,
                              client.salesman,
                              client.ymrep,
                              client.phone_no,
                              client.tel_no,
                              client.email,
                              client.address,
                              client.discount,
                              client.moneytype,
                              client.useflag,
                              client.remark1,
                              client.remark2,
                              client.remark3,
                              client.remark4,
                              client.remark5,
                              client.remark6,
                              client.remark7,
                              client.remark8,
                              client.remark9,
                              client.remark10,
                              client.creater,
                              client.createdAt,
                              client.clientareaid,
                              client.operateareaid,
                              client.currencyid,
                              client.gs
                        ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            client.clientcode,
            client.clientname,
            client.contactperson,
            client.salesman,
            client.ymrep,
            client.phone_no,
            client.tel_no,
            client.email,
            client.address,
            client.discount,
            client.moneytype,
            client.useflag,
            client.remark1,
            client.remark2,
            client.remark3,
            client.remark4,
            client.remark5,
            client.remark6,
            client.remark7,
            client.remark8,
            client.remark9,
            client.remark10,
            client.creater,
            client.createdAt,
            client.clientareaid,
            client.operateareaid,
            client.currencyid,
            client.gs
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增客户失败"));
        }
    }

    public async update(client: UpdateClientDto): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                            client 
                         SET 
                            client.clientcode = ?,
                            client.clientname = ?,
                            client.contactperson = ?,
                            client.salesman = ?,
                            client.ymrep = ?,
                            client.phone_no = ?,
                            client.tel_no = ?,
                            client.email = ?,
                            client.address = ?,
                            client.discount = ?,
                            client.moneytype = ?,
                            client.useflag = ?,
                            client.remark1 = ?,
                            client.remark2 = ?,
                            client.remark3 = ?,
                            client.remark4 = ?,
                            client.remark5 = ?,
                            client.remark6 = ?,
                            client.remark7 = ?,
                            client.remark8 = ?,
                            client.remark9 = ?,
                            client.remark10 = ?,
                            client.updater = ?,
                            client.updatedAt = ?,
                            client.clientareaid = ?,
                            client.operateareaid = ?,
                            client.currencyid = ?,
                            client.gs = ?
                         WHERE 
                            client.del_uuid = 0 
                            AND client.clientid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            client.clientcode,
            client.clientname,
            client.contactperson,
            client.salesman,
            client.ymrep,
            client.phone_no,
            client.tel_no,
            client.email,
            client.address,
            client.discount,
            client.moneytype,
            client.useflag,
            client.remark1,
            client.remark2,
            client.remark3,
            client.remark4,
            client.remark5,
            client.remark6,
            client.remark7,
            client.remark8,
            client.remark9,
            client.remark10,
            client.updater,
            client.updatedAt,
            client.clientareaid,
            client.operateareaid,
            client.currencyid,
            client.gs,
            client.clientid
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新客户失败"));
        }
    }

    public async delete_data(clientid: number, userName: string): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                client 
                             SET 
                                client.del_uuid = ?,
                                client.deletedAt = ?,
                                client.deleter = ?
                             WHERE
                                client.del_uuid = 0 
                                AND client.clientid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            clientid,
            new Date(),
            userName,
            clientid
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("删除客户失败"));
        }
    }

  public async l1Review(clientid: number, userName: string): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE 
                            client
                         SET 
                            client.level1review = 1,
                            client.level1name = ?,
                            client.level1date = ?
                         WHERE
                            client.del_uuid = 0 
                            AND client.clientid = ?
                            AND client.level1review = 0
                            AND client.level2review = 0`;
    const [res] = await conn.query<ResultSetHeader>(sql, [
      userName,
      new Date(),
      clientid
    ]);
    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("更新客户审核标记失败"));
    }
  }

  public async unl1Review(clientid: number): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE 
                            client
                         SET 
                            client.level1review = 0,
                            client.level1name = '',
                            client.level1date = ''
                         WHERE
                            client.del_uuid = 0 
                            AND client.clientid = ?
                            AND client.level1review = 1
                            AND client.level2review = 0`;
    const [res] = await conn.query<ResultSetHeader>(sql, [
        clientid
    ]);
    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("更新客户撤审标记失败"));
    }
  }

  public async l2Review(clientid: number, userName: string): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE 
                            client
                         SET 
                            client.level2review = 1,
                            client.level2name = ?,
                            client.level2date = ?
                         WHERE
                            client.del_uuid = 0 
                            AND client.clientid = ?
                            AND client.level1review = 1
                            AND client.level2review = 0`;
    const [res] = await conn.query<ResultSetHeader>(sql, [
      userName,
      new Date(),
      clientid
    ]);
    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("更新客户财务审核标记失败"));
    }
  }

  public async unl2Review(clientid: number): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE 
                            client
                         SET 
                            client.level2review = 0,
                            client.level2name = '',
                            client.level2date = ''
                         WHERE
                            client.del_uuid = 0 
                            AND client.clientid = ?
                            AND client.level1review = 1
                            AND client.level2review = 1`;
    const [res] = await conn.query<ResultSetHeader>(sql, [
      clientid
    ]);
    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("更新客户财务撤审标记失败"));
    }
  }


}