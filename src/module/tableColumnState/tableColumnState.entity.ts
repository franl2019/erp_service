import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {Injectable} from "@nestjs/common";
import {ResultSetHeader} from "mysql2/promise";
import {ITableColumnState} from "./tableColumnState";

@Injectable()
export class TableColumnStateEntity {
    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async find(tablename: string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT 
                       table_column_state.sn,
                       table_column_state.colId,
                       table_column_state.headerName,
                       table_column_state.hide,
                       table_column_state.pinned,
                       table_column_state.pivot,
                       table_column_state.pivotIndex,
                       table_column_state.rowGroup,
                       table_column_state.rowGroupIndex,
                       table_column_state.sort,
                       table_column_state.sortIndex,
                       table_column_state.width,
                       table_column_state.parentId,
                       table_column_state.isGroup,
                       table_column_state.headerClass
                     From 
                       table_column_state
                     WHERE
                       table_column_state.tableName = ?
                     ORDER BY
                       table_column_state.sn
    `;
        const [res] = await conn.query(sql, [tablename]);
        return res as ITableColumnState[];
    }

    public async create(tableColumnStates: ITableColumnState[],tableName:string) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO table_column_state (
                        table_column_state.tableName,
                        table_column_state.sn,
                        table_column_state.colId,
                        table_column_state.headerName,
                        table_column_state.headerClass,
                        table_column_state.hide,
                        table_column_state.pinned,
                        table_column_state.pivot,
                        table_column_state.pivotIndex,
                        table_column_state.rowGroup,
                        table_column_state.rowGroupIndex,
                        table_column_state.sort,
                        table_column_state.sortIndex,
                        table_column_state.width,
                        table_column_state.parentId,
                        table_column_state.isGroup 
                        ) VALUES ?`;
        const values = tableColumnStates.map((table_column_state) => [
            tableName,
            table_column_state.sn,
            table_column_state.colId,
            table_column_state.headerName,
            table_column_state.headerClass,
            table_column_state.hide,
            table_column_state.pinned,
            table_column_state.pivot,
            table_column_state.pivotIndex,
            table_column_state.rowGroup,
            table_column_state.rowGroupIndex,
            table_column_state.sort,
            table_column_state.sortIndex,
            table_column_state.width,
            table_column_state.parentId,
            table_column_state.isGroup
        ])
        const [res] = await conn.query<ResultSetHeader>(sql,
            [values]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error(`保存列设置错误`));
        }
    }

    public async deleteData(tablename: string) {
        if (tablename.length === 0) return
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM 
                        table_column_state 
                     WHERE 
                        table_column_state.tablename = ?`;
        await conn.query(sql, [tablename]);
    }


}

