import { Injectable } from "@nestjs/common";
import { ResultSetHeader } from "mysql2/promise";
import { SelectUserOperateAreaMxDto } from "./dto/selectUserOperateAreaMx.dto";
import { UserOperateAreaMx } from "./userOperateAreaMx";
import { AddUserOperateAreaMxDto } from "./dto/addUserOperateAreaMx.dto";
import { DeleteUserOperateAreaMxDto } from "./dto/deleteUserOperateAreaMx.dto";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { State } from "../../interface/IState";

@Injectable()
export class UserOperateAreaMxSql {
  constructor(private readonly mysqldbAls: MysqldbAls) {
  }

  //查询用户的操作区域权限ID数组
  public async getUserOperaAreaIdList(selectDto: SelectUserOperateAreaMxDto): Promise<number[]> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT 
                            operatearea.operateareaid 
                         FROM user_operateareamx
                            INNER JOIN operatearea ON user_operateareamx.operateareaid = operatearea.operateareaid
                         WHERE 
                            user_operateareamx.userid = ? 
                            AND operatearea.operateareatype = ?`;
    const [res] = await conn.query(sql, [selectDto.userid, selectDto.operateareatype]);
    let userOperaAreas: number[] = [];
    if ((res as UserOperateAreaMx[]).length > 0) {
      userOperaAreas = (res as UserOperateAreaMx[]).map(userOperaArea => userOperaArea.operateareaid);
    } else {
      userOperaAreas.push(0);
    }
    return userOperaAreas;
  }

  //查询用户的操作区域权限数组
  public async getUserOperaAreasInfoList(selectDto: SelectUserOperateAreaMxDto): Promise<any> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT 
                           user_operateareamx.userid,
                           user_operateareamx.operateareaid,
                           user_operateareamx.userflag,
                           user_operateareamx.creater,
                           user_operateareamx.createdAt,
                           operatearea.operateareaname
                         FROM 
                           user_operateareamx 
                         INNER JOIN operatearea ON user_operateareamx.operateareaid = operatearea.operateareaid
                         WHERE 
                           user_operateareamx.userid = ? 
                           AND operatearea.operateareatype = ?`;

    const [res] = await conn.query(sql, [selectDto.userid, selectDto.operateareatype]);
    return res as UserOperateAreaMx[];
  }


  //查询用户的单个操作区域权限
  public async getUserOperaArea(userOperateAreaMx: UserOperateAreaMx): Promise<UserOperateAreaMx> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT * FROM user_operateareamx WHERE userid = ? AND operateareaid = ?`;
    const [res] = await conn.query(sql, [userOperateAreaMx.userid, userOperateAreaMx.operateareaid]);
    if ((res as UserOperateAreaMx[]).length > 0) {
      return (res as UserOperateAreaMx[])[0];
    } else {
      return Promise.reject(new Error("找不到用户这个操作区域权限"));
    }
  }

  //为用户添加操作区域权限
  public async add(addDto: AddUserOperateAreaMxDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `INSERT INTO user_operateareamx SET ?`;
    const [res] = await conn.query(sql, addDto);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增用户操作区域权限失败"));
    }
  }

  //查询用户默认操作区域
  public async getUserDefaultOperateArea(state: State): Promise<UserOperateAreaMx> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `SELECT 
                           user_operateareamx.userid,
                           user_operateareamx.operateareaid,
                           user_operateareamx.userflag,
                           user_operateareamx.creater,
                           user_operateareamx.createdAt,
                           user_operateareamx.updater,
                           user_operateareamx.updatedAt
                         FROM 
                           user_operateareamx
                         WHERE 
                           user_operateareamx.userid = ?
                           AND user_operateareamx.userflag = 1`;
    const [res] = await conn.query(sql, [state.user.userid]);
    if ((res as UserOperateAreaMx[]).length > 0) {
      return (res[0] as UserOperateAreaMx);
    } else {
      return Promise.reject(new Error("查询用户默认操作区域失败"));
    }
  }

  //删除用户操作区域权限
  public async delete_data(deleteDto: DeleteUserOperateAreaMxDto): Promise<ResultSetHeader> {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `DELETE FROM user_operateareamx WHERE userid = ? AND operateareaid = ?`;
    const [res] = await conn.query(sql, [deleteDto.userid, deleteDto.operateareaid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("删除用户操作区域权限失败"));
    }
  }
}