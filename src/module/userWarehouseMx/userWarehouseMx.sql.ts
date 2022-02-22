import { Injectable } from "@nestjs/common";
import { ResultSetHeader } from "mysql2/promise";
import { SelectUserWarehouseMxDto } from "./dto/selectUserWarehouseMx.dto";
import { UserWarehouseMx, UserWarehouseMxInfo } from "./userWarehouseMx";
import { AddUserWarehouseMxDto } from "./dto/addUserWarehouseMx.dto";
import { DeleteUserWarehouseMxDto } from "./dto/deleteUserWarehouseMx.dto";
import { MysqldbAls } from "../mysqldb/mysqldbAls";


@Injectable()
export class UserWarehouseMxSql {

  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  public async getUserWarehouseMxs(selectDto: SelectUserWarehouseMxDto): Promise<number[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM user_warehousemx WHERE userid = ?`;
    const [res] = await conn.query(sql, [selectDto.userid]);
    let userWarehouseMxs: number[] = [];
    if ((res as UserWarehouseMx[]).length > 0) {
      userWarehouseMxs = (res as UserWarehouseMx[]).map(userWarehousemx => userWarehousemx.warehouseid);
    } else {
      userWarehouseMxs.push(0);
    }
    return userWarehouseMxs;
  }

  public async getUserWarehouseMx(selectDto: SelectUserWarehouseMxDto): Promise<UserWarehouseMx> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM user_warehousemx WHERE userid = ? AND warehouseid = ?`;
    const [res] = await conn.query(sql, [selectDto.userid, selectDto.warehouseid]);
    if ((res as UserWarehouseMx[]).length > 0) {
      return (res as UserWarehouseMx[])[0];
    } else {
      return Promise.reject(new Error("该用户没有此仓库权限"));
    }
  }

  public async getUserWarehouseMxInfo(selectDto: SelectUserWarehouseMxDto): Promise<UserWarehouseMxInfo[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT user_warehousemx.userid,user_warehousemx.creater,user_warehousemx.createdAt,warehouse.warehouseid,
                                warehouse.warehousename,warehouse.warehousecode 
                         FROM user_warehousemx
                         INNER JOIN warehouse ON warehouse.warehouseid = user_warehousemx.warehouseid
                         WHERE user_warehousemx.userid = ?`;
    const [res] = await conn.query(sql, [selectDto.userid]);
    return res as UserWarehouseMxInfo[];
  }

  public async add(addDto: AddUserWarehouseMxDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `INSERT INTO user_warehousemx SET ?`;
    const [res] = await conn.query(sql, addDto);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增用户仓库权限失败"));
    }
  }

  public async delete_data(deleteDto: DeleteUserWarehouseMxDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `DELETE FROM user_warehousemx WHERE userid = ? AND warehouseid = ?`;
    const [res] = await conn.query(sql, [deleteDto.userid, deleteDto.warehouseid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("删除用户仓库权限失败"));
    }
  }

}