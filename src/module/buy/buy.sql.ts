import { ResultSetHeader } from "mysql2/promise";
import { Buy } from "./buy";
import { AddBuyDto } from "./dto/addBuy.dto";
import { UpdateBuyDto } from "./dto/updateBuy.dto";
import { Injectable } from "@nestjs/common";
import { SelectBuyDto } from "./dto/selectBuy.dto";
import { DeleteBuyDto } from "./dto/deleteBuy.dto";
import { MysqldbAls } from "../mysqldb/mysqldbAls";

@Injectable()
export class BuySql {
  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  public async getBuy(buyid: number): Promise<Buy> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM buy WHERE del_uuid = 0 AND buyid = ?`;
    const [res] = await conn.query(sql, [buyid]);
    if ((res as Buy[]).length > 0) {
      return (res as Buy[])[0];
    } else {
      return Promise.reject(new Error("找不到单个供应商"));
    }
  }

  public async getBuys(buy: SelectBuyDto): Promise<Buy[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    let sql: string = `SELECT * FROM buy WHERE buy.del_uuid = 0 AND buy.operateareaid IN (?)`;
    let param = [];
    if (buy.operateareaids.length > 0) {
      param.push(buy.operateareaids);
    } else {
      param.push([0]);
    }

    if (buy.buyareaid) {
      sql = sql + ` AND buy.buyareaid = ?`;
      param.push(buy.buyareaid);
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

  public async getDeletedBuy(buyid: number): Promise<Buy> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM buy WHERE del_uuid <> 0 AND buyid = ?`;
    const [res] = await conn.query(sql, [buyid]);
    if ((res as Buy[]).length > 0) {
      return (res as Buy[])[0];
    } else {
      return Promise.reject(new Error("找不到单个供应商"));
    }
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

  public async add(buy: AddBuyDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `INSERT INTO buy SET ?`;
    const [res] = await conn.query(sql, buy);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增供应商失败"));
    }
  }

  public async update(buy: UpdateBuyDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE buy SET ? WHERE buyid = ?`;
    const [res] = await conn.query(sql, [buy, buy.buyid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("更新供应商失败"));
    }
  }

  public async delete_data(buy: DeleteBuyDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE buy SET ? WHERE buyid = ?`;
    const [res] = await conn.query(sql, [buy, buy.buyid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("删除供应商失败"));
    }
  }

  public async undelete(buy: DeleteBuyDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE buy SET ? WHERE buyid = ? AND del_uuid <> 0`;
    const [res] = await conn.query(sql, [buy, buy.buyid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("取消删除供应商失败"));
    }
  }
}