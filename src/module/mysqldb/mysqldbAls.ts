import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { PoolConnection } from "mysql2/promise";
import { Mysqldb } from "./mysqldb";

@Injectable()
export class MysqldbAls {
  private asyncLocalStorage: AsyncLocalStorage<PoolConnection>;

  constructor(
      private readonly mysqldb: Mysqldb
  ) {
    this.asyncLocalStorage = new AsyncLocalStorage();
  }

  public getConnectionInAls(): PoolConnection {
    const conn = this.asyncLocalStorage.getStore();
    if (conn) {
      return conn;
    } else {
      return this.mysqldb.getPool() as unknown as PoolConnection;
    }
  }

  public async sqlTransaction<T = any>(callback: () => Promise<T>):Promise<T> {
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