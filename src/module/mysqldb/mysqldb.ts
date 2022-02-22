import { Pool, PoolOptions } from "mysql2/promise";
import { DATABASE_CONFIG } from "../../config/database";
import * as mysql from "mysql2/promise";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Mysqldb {
  private readonly pool: Pool;

  private static config: PoolOptions = {
    connectionLimit: 50,
    host: DATABASE_CONFIG.HOST,
    port: DATABASE_CONFIG.POST,
    user: DATABASE_CONFIG.USER,
    password: DATABASE_CONFIG.PASSWORD,
    database: DATABASE_CONFIG.DATABASE,
    decimalNumbers: true,
    multipleStatements: false,
    typeCast: function(field, next) {
      if (field.type == "DECIMAL") {
        let value = field.string();
        return (value === null) ? null : Number(value);
      }
      return next();
    }
  };


  constructor() {
    this.pool = mysql.createPool(Mysqldb.config);
  }

  public getPool() {
    return this.pool;
  }

}