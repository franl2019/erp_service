import {ResultSetHeader} from "mysql2/promise";
import {Buy} from "./buy";
import {AddBuyDto} from "./dto/addBuy.dto";
import {UpdateBuyDto} from "./dto/updateBuy.dto";
import {Injectable} from "@nestjs/common";
import {SelectBuyDto} from "./dto/selectBuy.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {BuyAreaService} from "../buyArea/buyArea.service";

@Injectable()
export class BuyEntity {
    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly buyAreaService: BuyAreaService,
    ) {
    }

    public async findOne(buyId: number): Promise<Buy> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                            buy.buyid,
                            buy.buycode,
                            buy.buyname,
                            buy.contactperson,
                            buy.salesman,
                            buy.ymrep,
                            buy.phone_no,
                            buy.tel_no,
                            buy.email,
                            buy.address,
                            buy.moneytype,
                            buy.useflag,
                            buy.accountspayabletype,
                            buy.level1review,
                            buy.level1name,
                            buy.level1date,
                            buy.level2review,
                            buy.level2name,
                            buy.level2date,
                            buy.remark1,
                            buy.remark2,
                            buy.remark3,
                            buy.remark4,
                            buy.remark5,
                            buy.remark6,
                            buy.remark7,
                            buy.remark8,
                            buy.remark9,
                            buy.remark10,
                            buy.creater,
                            buy.createdAt,
                            buy.updater,
                            buy.updatedAt,
                            buy.buyareaid,
                            buy.operateareaid,
                            buy.del_uuid,
                            buy.deletedAt,
                            buy.deleter
                         FROM 
                            buy 
                         WHERE buy.del_uuid = 0 AND buy.buyid = ?`;
        const [res] = await conn.query(sql, [buyId]);
        if ((res as Buy[]).length > 0) {
            return (res as Buy[])[0];
        } else {
            return Promise.reject(new Error("找不到单个供应商"));
        }
    }

    public async find(buy: SelectBuyDto): Promise<Buy[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql: string = `SELECT 
                          buy.buyid,
                          buy.buycode,
                          buy.buyname,
                          buy.contactperson,
                          buy.salesman,
                          buy.ymrep,
                          buy.phone_no,
                          buy.tel_no,
                          buy.email,
                          buy.address,
                          buy.moneytype,
                          buy.useflag,
                          buy.accountspayabletype,
                          buy.level1review,
                          buy.level1name,
                          buy.level1date,
                          buy.level2review,
                          buy.level2name,
                          buy.level2date,
                          buy.remark1,
                          buy.remark2,
                          buy.remark3,
                          buy.remark4,
                          buy.remark5,
                          buy.remark6,
                          buy.remark7,
                          buy.remark8,
                          buy.remark9,
                          buy.remark10,
                          buy.creater,
                          buy.createdAt,
                          buy.updater,
                          buy.updatedAt,
                          buy.buyareaid,
                          buy.operateareaid,
                          buy.del_uuid,
                          buy.deletedAt,
                          buy.deleter
                       FROM 
                          buy 
                       WHERE 
                          buy.del_uuid = 0 
                          AND buy.operateareaid IN (?)`;
        let param = [];

        //操作区域
        if (buy.operateareaids.length > 0) {
            param.push(buy.operateareaids);
        } else {
            param.push([0]);
        }

        //供应商地区
        if (buy.buyareaid) {
            const buyArea = await this.buyAreaService.findOne(buy.buyareaid);
            //查询地区下的子地区所有资料
            const childIdList = await this.buyAreaService.getChildIdList(buyArea);
            sql = sql + ` AND buy.buyareaid IN (?)`;
            param.push(childIdList);
        }

        if (buy.useflag !== null) {
            sql = sql + ` AND buy.useflag = ?`;
            param.push(buy.useflag);
        }

        if (buy.search) {
            sql = sql + ` AND (buy.buycode LIKE ? OR buy.buyname LIKE ?)`;
            param.push(`%${buy.search}%`, `%${buy.search}%`);
        }
        if (buy.page && buy.pagesize) {
            sql = sql + ` LIMIT ?,?`;
            param.push(buy.page, buy.pagesize);
        }

        const [res] = await conn.query(sql, param);
        return (res as Buy[]);
    }

    public async getDeletedBuys(buy: SelectBuyDto): Promise<Buy[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql: string = `SELECT * FROM buy WHERE del_uuid <> 0 AND operateareaid IN (?)`;
        let param = [];
        if (buy.operateareaids.length > 0) {
            param.push(buy.operateareaids);
        } else {
            param.push([0]);
        }

        if (buy.buyareaid) {
            sql = sql + ` AND buyareaid = ?`;
            param.push(buy.buyareaid);
        }
        if (buy.search) {
            sql = sql + ` AND (buycode LIKE ? OR buyname LIKE ?)`;
            param.push(`%${buy.search}%`, `%${buy.search}%`);
        }
        if (buy.page !== undefined && buy.page !== null && buy.pagesize !== undefined && buy.pagesize !== null) {
            sql = sql + ` LIMIT ?,?`;
            param.push(buy.page, buy.pagesize);
        }
        const [res] = await conn.query(sql, param);
        return (res as Buy[]);
    }

    public async create(buy: AddBuyDto): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `INSERT INTO buy (
                                  buy.buycode,
                                  buy.buyname,
                                  buy.contactperson,
                                  buy.salesman,
                                  buy.ymrep,
                                  buy.phone_no,
                                  buy.tel_no,
                                  buy.email,
                                  buy.address,
                                  buy.moneytype,
                                  buy.useflag,
                                  buy.accountspayabletype,
                                  buy.remark1,
                                  buy.remark2,
                                  buy.remark3,
                                  buy.remark4,
                                  buy.remark5,
                                  buy.remark6,
                                  buy.remark7,
                                  buy.remark8,
                                  buy.remark9,
                                  buy.remark10,
                                  buy.creater,
                                  buy.createdAt,
                                  buy.buyareaid,
                                  buy.operateareaid
                            ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            buy.buycode,
            buy.buyname,
            buy.contactperson,
            buy.salesman,
            buy.ymrep,
            buy.phone_no,
            buy.tel_no,
            buy.email,
            buy.address,
            buy.moneytype,
            buy.useflag,
            buy.accountspayabletype,
            buy.remark1,
            buy.remark2,
            buy.remark3,
            buy.remark4,
            buy.remark5,
            buy.remark6,
            buy.remark7,
            buy.remark8,
            buy.remark9,
            buy.remark10,
            buy.creater,
            buy.createdAt,
            buy.buyareaid,
            buy.operateareaid
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增供应商失败"));
        }
    }

    public async update(buy: UpdateBuyDto): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                buy 
                             SET 
                                buy.buyname = ?,
                                buy.contactperson = ?,
                                buy.salesman = ?,
                                buy.ymrep = ?,
                                buy.phone_no = ?,
                                buy.tel_no = ?,
                                buy.email = ?,
                                buy.address = ?,
                                buy.moneytype = ?,
                                buy.useflag = ?,
                                buy.accountspayabletype = ?,
                                buy.remark1 = ?,
                                buy.remark2 = ?,
                                buy.remark3 = ?,
                                buy.remark4 = ?,
                                buy.remark5 = ?,
                                buy.remark6 = ?,
                                buy.remark7 = ?,
                                buy.remark8 = ?,
                                buy.remark9 = ?,
                                buy.remark10 = ?,
                                buy.updater = ?,
                                buy.updatedAt = ?,
                                buy.buyareaid = ?,
                                buy.operateareaid = ?
                             WHERE 
                                buy.level1review = 0
                                AND buy.level2review = 0 
                                AND buy.buyid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            buy.buyname,
            buy.contactperson,
            buy.salesman,
            buy.ymrep,
            buy.phone_no,
            buy.tel_no,
            buy.email,
            buy.address,
            buy.moneytype,
            buy.useflag,
            buy.accountspayabletype,
            buy.remark1,
            buy.remark2,
            buy.remark3,
            buy.remark4,
            buy.remark5,
            buy.remark6,
            buy.remark7,
            buy.remark8,
            buy.remark9,
            buy.remark10,
            buy.updater,
            buy.updatedAt,
            buy.buyareaid,
            buy.operateareaid,
            buy.buyid
        ]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error("更新供应商失败"));
        }
    }

    public async l1Review(buyId: number,userName:string): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                buy 
                             SET 
                                buy.level1review = 1,
                                buy.level1name = ?,
                                buy.level1date = ?
                             WHERE 
                                buy.level1review = 0
                                AND buy.level2review = 0
                                AND buy.buyid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            userName,
            new Date(),
            buyId
        ]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error("审核供应商更新标记失败"));
        }
    }

    public async l2Review(buyId: number,userName:string): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                buy 
                             SET 
                                buy.level2review = 1,
                                buy.level2name = ?,
                                buy.level2date = ?
                             WHERE 
                                buy.level1review = 1
                                AND buy.level2review = 0
                                AND buy.buyid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            userName,
            new Date(),
            buyId
        ]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error("财务审核供应商更新标记失败"));
        }
    }

    public async unl1Review(buyId: number): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                buy 
                             SET 
                                buy.level1review = 0,
                                buy.level1name = '',
                                buy.level1date = null
                             WHERE 
                                buy.level1review = 1
                                AND buy.level2review = 0
                                AND buy.buyid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            buyId
        ]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error("撤审供应商更新标记失败"));
        }
    }

    public async unl2Review(buyId: number): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                buy 
                             SET 
                                buy.level2review = 0,
                                buy.level2name = '',
                                buy.level2date = null
                             WHERE 
                                buy.level1review = 1
                                AND buy.level2review = 1
                                AND buy.buyid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            buyId
        ]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error("财务撤审供应商更新标记失败"));
        }
    }

    public async delete_data(buyId: number,userName:string): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE
                                buy 
                             SET
                                buy.del_uuid = ?,
                                buy.deletedAt = ?,
                                buy.deleter = ?
                             WHERE
                                buy.del_uuid = 0
                                AND buy.level1review = 0
                                AND buy.level2review = 0
                                AND buy.buyid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            buyId,
            new Date(),
            userName,
            buyId
        ]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error("删除供应商失败"))
        }
    }

    public async undelete(buyId: number): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE
                                buy 
                             SET
                                buy.del_uuid = 0,
                                buy.deletedAt = '',
                                buy.deleter = ''
                             WHERE
                                buy.del_uuid <> 0
                                AND buy.level1review = 0
                                AND buy.level2review = 0
                                AND buy.buyid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [buyId]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("取消删除供应商失败"));
        }
    }
}