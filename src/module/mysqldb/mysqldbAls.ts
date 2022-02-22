import { Injectable, Scope } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { Pool, PoolConnection } from "mysql2/promise";
import { Mysqldb } from "./mysqldb";

@Injectable({ scope: Scope.REQUEST })
export class MysqldbAls {
  private asyncLocalStorage: AsyncLocalStorage<PoolConnection>;

  constructor(private readonly mysqldb: Mysqldb) {
    this.asyncLocalStorage = new AsyncLocalStorage();
  }

  public getConnectionInAls(): PoolConnection | Pool {
    const conn = this.asyncLocalStorage.getStore();
    if (conn) {
      return conn;
    } else {
      return this.mysqldb.getPool();
    }
  }

  public async sqlTransaction(callback: () => Promise<any>) {
    //获取Als中的事务conn
    const conn = this.asyncLocalStorage.getStore();
    if (conn) {
      return await this.asyncLocalStorage.run(conn, callback);
    } else {
      const conn = await this.mysqldb.getPool().getConnection();
      try {
        await conn.beginTransaction();
        const res = await this.asyncLocalStorage.run(conn, callback);
        await conn.commit();
        await conn.release();
        return res;
      } catch (e) {
        await conn.rollback();
        await conn.release();
        await Promise.reject(e);
      }
    }
  }
}