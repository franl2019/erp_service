import { Injectable } from "@nestjs/common";
import { ResultSetHeader } from "mysql2/promise";
import { AutoCode } from "./autoCode";
import { MysqldbAls } from "../mysqldb/mysqldbAls";

@Injectable()
export class AutoCodeEntity {

  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  public async getInboundAutoCode(codeType:number) {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql = `SELECT 
                    autocode.codeType, autocode.codeName, autocode.updatedAt, autocode.updater, autocode.remark
                 FROM
                    autocode
                 WHERE
                    autocode.codeType = ?`;
    const [res] = await conn.query(sql, [codeType]);
    if ((res as AutoCode[]).length > 0) {
      return (res as AutoCode[])[0];
    } else {
      return Promise.reject(new Error("查询单据编号失败，无此类型"));
    }
  }

  public async getInboundAutoCodes() {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql = `SELECT 
                    autocode.codeType, autocode.codename, autocode.updatedAt, autocode.updater, autocode.remark
                 FROM
                    autocode`;
    const [res] = await conn.query(sql);
    if ((res as AutoCode[]).length > 0) {
      return (res as AutoCode[]);
    }
  }

  public async update(autoCode: AutoCode) {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql = `UPDATE autocode SET ? WHERE autocode.codeType = ?`;
    const [res] = await conn.query(sql, [autoCode, autoCode.codeType]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("更新单据编号失败，无此类型"));
    }
  }
}