import {ResultSetHeader} from "mysql2/promise";
import {AddClientAreaDto} from "./dto/addClientArea.dto";
import {UpdateClientAreaDto} from "./dto/updateClientArea.dto";
import {Injectable} from "@nestjs/common";
import {IClientArea} from "./clientArea";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IClient} from "../client/client";

@Injectable()
export class ClientAreaEntity {
    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    //查询客户地区
    public async findOne(clientareaid: number): Promise<IClientArea> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                            clientarea.clientareaid,
                            clientarea.clientareacode,
                            clientarea.clientareaname,
                            clientarea.sonflag,
                            clientarea.parentid,
                            clientarea.parentCode,
                            clientarea.creater,
                            clientarea.createdAt,
                            clientarea.updater,
                            clientarea.updatedAt,
                            clientarea.del_uuid,
                            clientarea.deletedAt,
                            clientarea.deleter
                        FROM 
                            clientarea 
                        WHERE 
                            clientarea.del_uuid = 0 
                            AND clientarea.clientareaid = ?`;
        const [res] = await conn.query(sql, [clientareaid]);
        if ((res as IClientArea[]).length > 0) {
            return (res as IClientArea[])[0];
        } else {
            return Promise.reject(new Error("找不到单个客户地区资料"));
        }
    }

    //查询客户地区
    public async find(): Promise<IClientArea[]> {
        const conn = this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                            clientarea.clientareaid,
                            clientarea.clientareacode,
                            clientarea.clientareaname,
                            clientarea.sonflag,
                            clientarea.parentid,
                            clientarea.parentCode,
                            clientarea.creater,
                            clientarea.createdAt,
                            clientarea.updater,
                            clientarea.updatedAt,
                            clientarea.del_uuid,
                            clientarea.deletedAt,
                            clientarea.deleter
                        FROM 
                            clientarea 
                        WHERE 
                            clientarea.del_uuid = 0`;
        const [res] = await conn.query(sql);
        return (res as IClientArea[]);
    }

    //获取客户地区下级区域
    public async getChildrenClientArea(parentid: number): Promise<IClientArea[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                            clientarea.clientareaid,
                            clientarea.clientareacode,
                            clientarea.clientareaname,
                            clientarea.sonflag,
                            clientarea.parentid,
                            clientarea.parentCode,
                            clientarea.creater,
                            clientarea.createdAt,
                            clientarea.updater,
                            clientarea.updatedAt,
                            clientarea.del_uuid,
                            clientarea.deletedAt,
                            clientarea.deleter
                         FROM 
                            clientarea
                         WHERE 
                            clientarea.del_uuid = 0 
                            AND clientarea.parentid = ?`;
        const [res] = await conn.query(sql, [parentid]);
        return (res as IClientArea[]);
    }

    public async getClientBelongsToClientArea(clientareaid: number): Promise<IClient[]> {
        if (clientareaid) {
            const conn = await this.mysqldbAls.getConnectionInAls();
            let sql: string = `SELECT 
                            client.clientid 
                         FROM 
                            client 
                         WHERE 
                            client.del_uuid = 0 
                            AND client.clientareaid = ?  
                         LIMIT 0,1`;
            const [res] = await conn.query(sql, [clientareaid]);
            return (res as IClient[]);
        }
    }

    //新增客户地区
    public async create(clientArea: AddClientAreaDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `INSERT INTO clientarea (
                    clientarea.clientareaid,
                    clientarea.clientareacode,
                    clientarea.clientareaname,
                    clientarea.sonflag,
                    clientarea.parentid,
                    clientarea.parentCode,
                    clientarea.creater,
                    clientarea.createdAt
                ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            clientArea.clientareaid,
            clientArea.clientareacode,
            clientArea.clientareaname,
            clientArea.sonflag,
            clientArea.parentid,
            clientArea.parentCode,
            clientArea.creater,
            clientArea.createdAt
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增客户地区失败"));
        }
    }

    //更新客户地区
    public async update(clientarea: UpdateClientAreaDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                            clientarea 
                         SET
                            clientarea.clientareacode = ?,
                            clientarea.clientareaname = ?,
                            clientarea.sonflag = ?,
                            clientarea.parentid = ?,
                            clientarea.parentCode = ?,
                            clientarea.updater = ?,
                            clientarea.updatedAt = ?
                         WHERE 
                            clientarea.clientareaid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            clientarea.clientareacode,
            clientarea.clientareaname,
            clientarea.sonflag,
            clientarea.parentid,
            clientarea.parentCode,
            clientarea.updater,
            clientarea.updatedAt,
            clientarea.clientareaid
        ]);
        if (res.affectedRows > 0) {
            return res;
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
            const clientArea_DB = await this.findOne(clientareaid);
            clientArea_DB.sonflag = 0;
            await this.update(clientArea_DB);
        } else {
            const clientArea_DB = await this.findOne(clientareaid);
            clientArea_DB.sonflag = 1;
            await this.update(clientArea_DB);
        }

    }

    //删除客户地区
    public async delete_data(clientareaid: number, userName: string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                clientarea 
                             SET
                                clientarea.del_uuid = ?,
                                clientarea.deletedAt = ?,
                                clientarea.deleter = ?
                             WHERE 
                                clientarea.clientareaid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            clientareaid,
            new Date(),
            userName,
            clientareaid
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("删除客户地区失败"));
        }
    }
}