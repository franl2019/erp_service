import { ResultSetHeader } from "mysql2/promise";
import { BuyArea } from "./buyArea";
import { AddBuyAreaDto } from "./dto/addBuyArea.dto";
import { UpdateBuyAreaDto } from "./dto/updateBuyArea.dto";
import { Injectable } from "@nestjs/common";
import { DeleteBuyAreaDto } from "./dto/deleteBuyArea.dto";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { IBuy } from "../buy/buy";


@Injectable()
export class BuyAreaSql {
  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  //查询供应商地区
  public async getBuyArea(buyareaid: number): Promise<BuyArea> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM buyarea WHERE del_uuid = 0 AND buyareaid = ?`;
    const [res] = await conn.query(sql, [buyareaid]);
    if ((res as BuyArea[]).length > 0) {
      return (res as BuyArea[])[0];
    } else {
      return Promise.reject(new Error("找不到单个供应商地区"));
    }

  }

  //查询供应商地区
  public async getBuyAreas(): Promise<BuyArea[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM buyarea WHERE del_uuid = 0`;
    const [res] = await conn.query(sql);
    return (res as BuyArea[]);
  }

  //查询供应商地区
  public async getDeleteBuyArea(buyareaid: number): Promise<BuyArea> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM buyarea WHERE del_uuid <> 0 AND buyareaid = ?`;
    const [res] = await conn.query(sql, [buyareaid]);
    if ((res as BuyArea[]).length > 0) {
      return (res as BuyArea[])[0];
    } else {
      return Promise.reject(new Error("找不到单个供应商地区"));
    }

  }

  //查询供应商地区
  public async getDeleteBuyAreas(): Promise<BuyArea[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM buyarea WHERE del_uuid <> 0`;
    const [res] = await conn.query(sql);
    return (res as BuyArea[]);
  }

  //获取供应商地区下级区域
  public async getChildrenBuyArea(parentid: number): Promise<BuyArea[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM buyarea WHERE del_uuid = 0 AND parentid = ?`;
    const [res] = await conn.query(sql, [parentid]);
    return (res as BuyArea[]);
  }

  //获取供应商地区下属于它的供应商
  public async getBuyBelongsToBuyArea(buyareaid:number) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql:string = `SELECT * FROM buy WHERE buy.del_uuid = 0 AND buy.buyareaid = ? LIMIT 0,1`;
    const [res] = await conn.query(sql,[buyareaid]);
    return (res as IBuy[]);
  }

  //新增供应商地区
  public async add(buyArea: AddBuyAreaDto) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = "INSERT INTO buyarea SET ?";
    const [res] = await conn.query(sql, buyArea);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增供应商地区失败"));
    }
  }

  //更新供应商地区
  public async update(buyarea: UpdateBuyAreaDto) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE buyarea SET ? WHERE buyareaid = ?`;
    const [res] = await conn.query(sql, [buyarea, buyarea.buyareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
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
      const buyArea_DB = await this.getBuyArea(buyareaid);
      buyArea_DB.sonflag = 0;
      await this.update(buyArea_DB);
    } else {
      const buyArea_DB = await this.getBuyArea(buyareaid);
      buyArea_DB.sonflag = 1;
      await this.update(buyArea_DB);
    }

  }

  //删除供应商地区
  public async delete_data(buyarea: DeleteBuyAreaDto) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE buyarea SET ? WHERE buyareaid = ?`;
    const [res] = await conn.query(sql, [buyarea, buyarea.buyareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("删除供应商地区失败"));
    }
  }

  //取消删除供应商地区
  public async undelete(buyarea: DeleteBuyAreaDto) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE buyarea SET ? WHERE buyareaid = ?`;
    const [res] = await conn.query(sql, [buyarea, buyarea.buyareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("取消删除供应商地区失败"));
    }
  }
}