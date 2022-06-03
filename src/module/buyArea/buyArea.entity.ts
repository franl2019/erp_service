import {ResultSetHeader} from "mysql2/promise";
import {IBuyArea} from "./buyArea";
import {AddBuyAreaDto} from "./dto/addBuyArea.dto";
import {UpdateBuyAreaDto} from "./dto/updateBuyArea.dto";
import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IBuy} from "../buy/buy";


@Injectable()
export class BuyAreaEntity {
    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    //查询单个供应商地区
    public async findOne(buyareaid: number): Promise<IBuyArea> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                            buyarea.buyareaid,
                            buyarea.buyareacode,
                            buyarea.buyareaname,
                            buyarea.sonflag,
                            buyarea.parentid,
                            buyarea.parentCode,
                            buyarea.creater,
                            buyarea.createdAt,
                            buyarea.updater,
                            buyarea.updatedAt,
                            buyarea.del_uuid,
                            buyarea.deletedAt,
                            buyarea.deleter
                         FROM 
                            buyarea 
                         WHERE 
                            del_uuid = 0 
                            AND buyareaid = ?
                         `;
        const [res] = await conn.query(sql, [buyareaid]);
        if ((res as IBuyArea[]).length > 0) {
            return (res as IBuyArea[])[0];
        } else {
            return Promise.reject(new Error("找不到单个供应商地区"));
        }

    }

    //查询供应商地区
    public async find(): Promise<IBuyArea[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                            buyarea.buyareaid,
                            buyarea.buyareacode,
                            buyarea.buyareaname,
                            buyarea.sonflag,
                            buyarea.parentid,
                            buyarea.parentCode,
                            buyarea.creater,
                            buyarea.createdAt,
                            buyarea.updater,
                            buyarea.updatedAt,
                            buyarea.del_uuid,
                            buyarea.deletedAt,
                            buyarea.deleter
                         FROM 
                            buyarea 
                        WHERE 
                            del_uuid = 0`;
        const [res] = await conn.query(sql);
        return (res as IBuyArea[]);
    }

    //查询已删除单个供应商地区
    public async getDeleteBuyArea(buyareaid: number): Promise<IBuyArea> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                            buyarea.buyareaid,
                            buyarea.buyareacode,
                            buyarea.buyareaname,
                            buyarea.sonflag,
                            buyarea.parentid,
                            buyarea.parentCode,
                            buyarea.creater,
                            buyarea.createdAt,
                            buyarea.updater,
                            buyarea.updatedAt,
                            buyarea.del_uuid,
                            buyarea.deletedAt,
                            buyarea.deleter 
                         FROM 
                            buyarea 
                         WHERE 
                            del_uuid <> 0 
                            AND buyareaid = ?`;
        const [res] = await conn.query(sql, [buyareaid]);
        if ((res as IBuyArea[]).length > 0) {
            return (res as IBuyArea[])[0];
        } else {
            return Promise.reject(new Error("找不到单个供应商地区"));
        }

    }

    //查询已删除供应商地区
    public async getDeleteBuyAreas(): Promise<IBuyArea[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                            buyarea.buyareaid,
                            buyarea.buyareacode,
                            buyarea.buyareaname,
                            buyarea.sonflag,
                            buyarea.parentid,
                            buyarea.parentCode,
                            buyarea.creater,
                            buyarea.createdAt,
                            buyarea.updater,
                            buyarea.updatedAt,
                            buyarea.del_uuid,
                            buyarea.deletedAt,
                            buyarea.deleter
                         FROM 
                            buyarea WHERE del_uuid <> 0`;
        const [res] = await conn.query(sql);
        return (res as IBuyArea[]);
    }

    //获取供应商地区下级区域
    public async getChildrenBuyArea(parentid: number): Promise<IBuyArea[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                            buyarea.buyareaid,
                            buyarea.buyareacode,
                            buyarea.buyareaname,
                            buyarea.sonflag,
                            buyarea.parentid,
                            buyarea.parentCode,
                            buyarea.creater,
                            buyarea.createdAt,
                            buyarea.updater,
                            buyarea.updatedAt,
                            buyarea.del_uuid,
                            buyarea.deletedAt,
                            buyarea.deleter
                         FROM buyarea WHERE del_uuid = 0 AND parentid = ?`;
        const [res] = await conn.query(sql, [parentid]);
        return (res as IBuyArea[]);
    }

    //获取供应商地区下属于它的供应商
    public async getBuyBelongsToBuyArea(buyareaid: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT * FROM buy WHERE buy.del_uuid = 0 AND buy.buyareaid = ? LIMIT 0,1`;
        const [res] = await conn.query(sql, [buyareaid]);
        return (res as IBuy[]);
    }

    //新增供应商地区
    public async create(buyArea: AddBuyAreaDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `INSERT INTO buyarea (
                            buyarea.buyareacode,
                            buyarea.buyareaname,
                            buyarea.sonflag,
                            buyarea.parentid,
                            buyarea.parentCode,
                            buyarea.creater,
                            buyarea.createdAt
                         ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            buyArea.buyareacode,
            buyArea.buyareaname,
            buyArea.sonflag,
            buyArea.parentid,
            buyArea.parentCode,
            buyArea.creater,
            buyArea.createdAt
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增供应商地区失败"));
        }
    }

    //更新供应商地区
    public async update(buyarea: UpdateBuyAreaDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `
                         UPDATE 
                            buyarea 
                         SET
                            buyarea.buyareacode = ?,
                            buyarea.buyareaname = ?,
                            buyarea.sonflag = ?,
                            buyarea.parentid = ?,
                            buyarea.parentCode = ?,
                            buyarea.updater = ?,
                            buyarea.updatedAt = ?
                         WHERE 
                            buyarea.buyareaid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            buyarea.buyareacode,
            buyarea.buyareaname,
            buyarea.sonflag,
            buyarea.parentid,
            buyarea.parentCode,
            buyarea.updater,
            buyarea.updatedAt,
            buyarea.buyareaid
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新供应商地区失败"));
        }
    }

    //更新供应商地区sonflag标记
    public async updateSonflag(buyareaid: number) {
        //获取下级地区
        const childrenList = await this.getChildrenBuyArea(buyareaid);
        //如果没有下级地区更新sonflag = 0
        if (childrenList.length === 0) {
            const buyArea_DB = await this.findOne(buyareaid);
            buyArea_DB.sonflag = 0;
            await this.update(buyArea_DB);
        } else {
            const buyArea_DB = await this.findOne(buyareaid);
            buyArea_DB.sonflag = 1;
            await this.update(buyArea_DB);
        }

    }

    //删除供应商地区
    public async delete_data(buyareaId: number, userName: string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                buyarea 
                             SET
                                buyarea.del_uuid = ?,
                                buyarea.deletedAt = ?,
                                buyarea.deleter = ?
                             WHERE
                                buyarea.del_uuid = 0
                                AND buyarea.buyareaid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            buyareaId,
            new Date(),
            userName,
            buyareaId
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("删除供应商地区失败"));
        }
    }

    //取消删除供应商地区
    public async undelete(buyareaId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                buyarea 
                             SET
                                buyarea.del_uuid = 0,
                                buyarea.deletedAt = '',
                                buyarea.deleter = ''
                             WHERE
                                buyarea.del_uuid <> 0
                                AND buyarea.buyareaid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [buyareaId]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("取消删除供应商地区失败"));
        }
    }
}