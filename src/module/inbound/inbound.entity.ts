import {Injectable} from "@nestjs/common";
import {ResultSetHeader} from "mysql2/promise";
import {IInbound, Inbound} from "./inbound";
import {FindInboundDto} from "./dto/findInbound.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {FindInboundList} from "./dto/findInboundList";


@Injectable()
export class InboundEntity {

    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async findOne(inboundid: number): Promise<Inbound> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT
                          inbound.inboundid,
                          inbound.inboundcode,
                          inbound.inboundtype,
                          inbound.indate,
                          inbound.moneytype,
                          inbound.relatednumber,
                          inbound.remark1,
                          inbound.remark2,
                          inbound.remark3,
                          inbound.remark4,
                          inbound.remark5,
                          inbound.printcount,
                          inbound.level1review,
                          inbound.level1name,
                          inbound.level1date,
                          inbound.level2review,
                          inbound.level2name,
                          inbound.level2date,
                          inbound.creater,
                          inbound.createdAt,
                          inbound.updater,
                          inbound.updatedAt,
                          inbound.warehouseid,
                          inbound.clientid,
                          inbound.buyid,
                          inbound.del_uuid,
                          inbound.deletedAt,
                          inbound.deleter 
                         FROM
                          inbound
                         WHERE
                          inbound.inboundid = ?`;
        const [res] = await conn.query(sql, [inboundid]);
        if ((res as Inbound[]).length > 0) {
            return (res as Inbound[])[0];
        } else {
            return Promise.reject(new Error("找不到进仓单的单头"));
        }
    }

    //综合查询单头
    public async find(findDto: FindInboundDto): Promise<FindInboundList[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql: string = `SELECT
                        inbound.inboundid,
                        inbound.inboundcode,
                        inbound.inboundtype,
                        inbound.indate,
                        inbound.moneytype,
                        inbound.relatednumber,
                        inbound.remark1,
                        inbound.remark2,
                        inbound.remark3,
                        inbound.remark4,
                        inbound.remark5,
                        inbound.printcount,
                        inbound.level1review,
                        inbound.level1name,
                        inbound.level1date,
                        inbound.level2review,
                        inbound.level2name,
                        inbound.level2date,
                        inbound.creater,
                        inbound.createdAt,
                        inbound.updater,
                        inbound.updatedAt,
                        inbound.warehouseid,
                        inbound.clientid,
                        inbound.buyid,
                        inbound.del_uuid,
                        inbound.deletedAt,
                        inbound.deleter,
                        (
                           SELECT
                             round(
                                SUM(inbound_mx.priceqty * inbound_mx.netprice),2
                             )
                           FROM
                             inbound_mx
                           WHERE
                             inbound_mx.inboundid = inbound.inboundid
                        ) AS amt,
                        warehouse.warehousename,
                        client.clientname,
                        buy.buyname
                       FROM 
                        inbound
                        INNER JOIN warehouse ON inbound.warehouseid = warehouse.warehouseid
                        LEFT JOIN client ON inbound.clientid = client.clientid
                        LEFT JOIN buy ON inbound.buyid = buy.buyid
                       WHERE inbound.del_uuid = 0`;
        let params = [];

        //按仓库查询
        if (findDto.warehouseids.length > 0) {
            sql = sql + ` AND inbound.warehouseid IN (?)`;
            params.push(findDto.warehouseids);
        } else {
            return Promise.reject(new Error("查询出仓单失败，缺少仓库权限ID"));
        }

        //按客户查询
        if (findDto.clientid !== 0) {
            sql = sql + ` AND inbound.clientid IN (?)`;
            params.push([findDto.clientid]);
        }

        switch (findDto.inboundtype) {
            case 1:
                //按操作区域查询
                if (findDto.operateareaids.length > 0) {
                    sql = sql + ` AND inbound.inboundtype = ?`;
                    sql = sql + ` AND buy.operateareaid IN (?)`;
                    params.push(findDto.inboundtype, findDto.operateareaids);
                } else {
                    return Promise.reject(new Error("查询出仓单失败，缺少供应商操作区域权限ID"));
                }
                break;
            case 2:
                if (findDto.operateareaids.length > 0) {
                    sql = sql + ` AND inbound.inboundtype = ?`;
                    sql = sql + ` AND client.operateareaid IN (?)`;
                    params.push(findDto.inboundtype, findDto.operateareaids);
                } else {
                    return Promise.reject(new Error("查询出仓单失败，缺少客户操作区域权限ID"));
                }
                break;
            default:
                return Promise.reject(new Error("查询进仓单失败，进仓单类型错误"));
        }

        //按出仓日期范围查询
        if (findDto.startDate.length > 0 && findDto.endDate.length > 0) {
            sql = sql + ` AND DATE(inbound.indate) BETWEEN ? AND ?`;
            params.push(findDto.startDate, findDto.endDate);
        }

        //按id查询
        if (findDto.inboundid !== 0) {
            sql = sql + ` AND inbound.inboundid = ?`;
            params.push(findDto.inboundid);
        }

        //按出仓单编号查询
        if (findDto.inboundcode.length > 0) {
            sql = sql + ` AND inbound.inboundcode = ?`;
            params.push(findDto.inboundcode);
        }

        //按出仓单相关号码查询
        if (findDto.relatednumber.length > 0) {
            sql = sql + ` AND inbound.relatednumber LIKE ?`;
            params.push(`%${findDto.relatednumber}%`);
        }

        //按出仓单相关号码查询
        if (findDto.buyname.length > 0) {
            sql = sql + ` AND buy.buyname LIKE ?`;
            params.push(`%${findDto.buyname}%`);
        }

        console.log(findDto.moneytype)

        //按结算方式查询
        if (findDto.moneytype.length > 0) {
            sql = sql + ` AND inbound.moneytype LIKE ?`;
            params.push(`%${findDto.moneytype}%`);
        }

        if (findDto.remark1.length > 0) {
            sql = sql + ` AND inbound.remark1 LIKE ?`;
            params.push(`%${findDto.remark1}%`);
        }

        if (findDto.remark2.length > 0) {
            sql = sql + ` AND inbound.remark2 LIKE ?`;
            params.push(`%${findDto.remark2}%`);
        }

        if (findDto.remark3.length > 0) {
            sql = sql + ` AND inbound.remark3 LIKE ?`;
            params.push(`%${findDto.remark3}%`);
        }

        if (findDto.remark4.length > 0) {
            sql = sql + ` AND inbound.remark4 LIKE ?`;
            params.push(`%${findDto.remark4}%`);
        }

        if (findDto.remark5.length > 0) {
            sql = sql + ` AND inbound.remark5 LIKE ?`;
            params.push(`%${findDto.remark5}%`);
        }

        //分页查询
        if (findDto.page > 0 && findDto.pagesize > 0) {
            sql = sql + ` LIMIT ?,?`;
            params.push(findDto.page, findDto.pagesize);
        }

        sql = sql + ` ORDER BY inbound.inboundid DESC`

        const [res] = await conn.query(sql, params);
        return (res as FindInboundList[]);
    }

    public async create(inbound: IInbound) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `INSERT INTO inbound (
                          inbound.inboundid,
                          inbound.inboundcode,
                          inbound.inboundtype,
                          inbound.indate,
                          inbound.moneytype,
                          inbound.relatednumber,
                          inbound.remark1,
                          inbound.remark2,
                          inbound.remark3,
                          inbound.remark4,
                          inbound.remark5,
                          inbound.printcount,
                          inbound.level1review,
                          inbound.level1name,
                          inbound.level1date,
                          inbound.level2review,
                          inbound.level2name,
                          inbound.level2date,
                          inbound.creater,
                          inbound.createdAt,
                          inbound.updater,
                          inbound.updatedAt,
                          inbound.warehouseid,
                          inbound.clientid,
                          inbound.buyid,
                          inbound.del_uuid,
                          inbound.deletedAt,
                          inbound.deleter 
                        ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            inbound.inboundid,
            inbound.inboundcode,
            inbound.inboundtype,
            inbound.indate,
            inbound.moneytype,
            inbound.relatednumber,
            inbound.remark1,
            inbound.remark2,
            inbound.remark3,
            inbound.remark4,
            inbound.remark5,
            inbound.printcount,
            inbound.level1review,
            inbound.level1name,
            inbound.level1date,
            inbound.level2review,
            inbound.level2name,
            inbound.level2date,
            inbound.creater,
            inbound.createdAt,
            inbound.updater,
            inbound.updatedAt,
            inbound.warehouseid,
            inbound.clientid,
            inbound.buyid,
            inbound.del_uuid,
            inbound.deletedAt,
            inbound.deleter]]]);
        if (res.affectedRows > 0 && res.insertId !== 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增进仓单失败"));
        }
    }

    public async update(inbound: IInbound) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                  inbound 
                             SET
                                  inbound.inboundtype = ?,
                                  inbound.indate = ?,
                                  inbound.moneytype = ?,
                                  inbound.relatednumber = ?,
                                  inbound.remark1 = ?,
                                  inbound.remark2 = ?,
                                  inbound.remark3 = ?,
                                  inbound.remark4 = ?,
                                  inbound.remark5 = ?,
                                  inbound.updater = ?,
                                  inbound.updatedAt = ?,
                                  inbound.warehouseid = ?,
                                  inbound.clientid = ?,
                                  inbound.buyid = ?
                             WHERE 
                                inbound.inboundid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            inbound.inboundtype,
            inbound.indate,
            inbound.moneytype,
            inbound.relatednumber,
            inbound.remark1,
            inbound.remark2,
            inbound.remark3,
            inbound.remark4,
            inbound.remark5,
            inbound.updater,
            inbound.updatedAt,
            inbound.warehouseid,
            inbound.clientid,
            inbound.buyid,
            inbound.inboundid]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新进仓单的单头失败"));
        }
    }

    public async delete_data(inboundid:number,userName:string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                  inbound 
                             SET
                                  inbound.del_uuid = ?,
                                  inbound.deletedAt = ?,
                                  inbound.deleter = ? 
                             WHERE 
                                inbound.inboundid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            inboundid,
            new Date(),
            userName,
            inboundid]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新进仓单删除标记失败"));
        }
    }

    public async undelete_data(inboundid:number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                  inbound 
                             SET
                                  inbound.del_uuid = 0,
                                  inbound.deletedAt = '',
                                  inbound.deleter = '' 
                             WHERE 
                                inbound.inboundid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            inboundid
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("进仓单取消删除标记更新失败"));
        }
    }

    public async l1Review(inboundid:number,userName:string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                  inbound 
                             SET
                                   inbound.level1review = 1,
                                   inbound.level1name = ?,
                                   inbound.level1date = ?
                             WHERE 
                                inbound.level1review = 0
                                AND inbound.level2review = 0
                                AND inbound.del_uuid = 0
                                AND inbound.inboundid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            userName,
            new Date(),
            inboundid]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新进仓单审核标记失败"));
        }
    }

    public async l2Review(inboundid:number,userName:string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                  inbound 
                             SET
                                   inbound.level2review = 1,
                                   inbound.level2name = ?,
                                   inbound.level2date = ?
                             WHERE 
                                inbound.level1review = 1
                                AND inbound.level2review = 0
                                AND inbound.del_uuid = 0
                                AND inbound.inboundid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            userName,
            new Date(),
            inboundid
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新进仓单财务审核标记失败"));
        }
    }

    public async unl1Review(inboundid:number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                  inbound 
                             SET
                                   inbound.level1review = 0,
                                   inbound.level1name = '',
                                   inbound.level1date = null
                             WHERE 
                                inbound.level1review = 1
                                AND inbound.level2review = 0
                                AND inbound.del_uuid = 0
                                AND inbound.inboundid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            inboundid
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("进仓单更新撤审标记失败"));
        }
    }

    public async unl2Review(inboundid:number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                  inbound 
                             SET
                                   inbound.level2review = 0,
                                   inbound.level2name = '',
                                   inbound.level2date = null
                             WHERE 
                                inbound.level1review = 1
                                AND inbound.level2review = 1
                                AND inbound.del_uuid = 0
                                AND inbound.inboundid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            inboundid
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("进仓单撤审财务审核失败"));
        }
    }
}