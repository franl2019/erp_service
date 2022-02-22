import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { Injectable } from "@nestjs/common";
import { ResultSetHeader } from "mysql2/promise";

export interface IColumnState {
  sn:number;

  tableName: string;
  /** ag-grid聚合函数 */
  aggFunc: string;

  /** 列 ID  */
  colId: string;

  /** Column's flex if flex is set */
  flex: number;

  /** 列是否隐藏 */
  hide: boolean;

  /** 固定列 ”left“ or ”right“ */
  pinned: string;

  /** True if pivot active */
  pivot: boolean;

  /** The order of the pivot, if pivoting by many columns */
  pivotIndex: number;

  /** True if row group active */
  rowGroup: boolean;

  /** The order of the row group, if grouping by many columns */
  rowGroupIndex: number;

  /** 排序 */
  sort: string;

  /** 多列排序的顺序 */
  sortIndex: number;

  /** 宽度 px单位 */
  width: number;
}

@Injectable()
export class TableColumnStateEntity {
  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  public async find(tablename: string) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql = `SELECT * FROM table_column_state WHERE table_column_state.tablename = ? ORDER BY table_column_state.sn`;
    const [res] = await conn.query(sql, [tablename]);
    return res as IColumnState[];
  }

  public async create(createDto: IColumnState) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql = `INSERT INTO table_column_state SET ?`;
    const [res] = await conn.query(sql, [createDto]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error(`保存${createDto.colId}列设置错误`));
    }
  }

  public async deleteData(tablename: string) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql = `DELETE FROM table_column_state WHERE tablename = ?`;
    await conn.query(sql, [tablename]);
  }


}

