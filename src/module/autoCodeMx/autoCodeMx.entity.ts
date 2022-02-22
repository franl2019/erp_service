import { ResultSetHeader } from "mysql2/promise";
import { AutoCodeMx } from "./autoCodeMx";
import { Injectable } from "@nestjs/common";
import { MysqldbAls } from "../mysqldb/mysqldbAls";


@Injectable()
export class AutoCodeMxEntity {
  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  public async getInboundAutocodeMx(codeType:number): Promise<AutoCodeMx> {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql = `SELECT 
                    autocode_mx.codeType,
                    autocode_mx.codeNo,
                    autocode_mx.createdAt 
                 FROM 
                    autocode_mx
                 WHERE
                    autocode_mx.codeType = ? 
                    AND autocode_mx.createdAt = convert(?,DATE)`;
    const [res] = await conn.query(sql, [codeType,new Date()]);
    if ((res as AutoCodeMx[]).length > 0) {
      return (res as AutoCodeMx[])[0];
    } else {
      return null;
    }
  }

  public async add(autoCodeMx: AutoCodeMx) {
    const conn =  await this.mysqldbAls.getConnectionInAls();
    const sql = `INSERT INTO autocode_mx SET ?`;
    const [res] = await conn.query<ResultSetHeader>(sql, [autoCodeMx]);
    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("新增进仓单自动单号明细失败"));
    }
  }

  public async update(autoCodeMx: AutoCodeMx) {
    const conn =  await this.mysqldbAls.getConnectionInAls()
    const sql = `UPDATE
                    autocode_mx 
                 SET ? 
                 WHERE 
                    autocode_mx.codeType = ? 
                    AND autocode_mx.createdAt = convert(?,DATE)`;
    const [res] = await conn.query<ResultSetHeader>(sql, [autoCodeMx, autoCodeMx.codeType, autoCodeMx.createdAt]);
    if (res.affectedRows > 0) {
      return res;
    } else {
      return Promise.reject(new Error("更新进仓单自动单号明细失败"));
    }
  }
}