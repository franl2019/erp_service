import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IUserRoleMx, IUserRoleMxJoinUser} from "./userRoleMx";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class UserRoleMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findByUserId(userId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        user.username,
                        user_role_mx.userid,
                        user_role_mx.roleId,
                        user_role_mx.creater,
                        user_role_mx.createdAt
                     FROM
                        user_role_mx
                        INNER JOIN user on user.userid = user_role_mx.userid
                     WHERE
                        user_role_mx.userid = ?`;
        const [res] = await conn.query(sql, [userId]);
        return res as IUserRoleMxJoinUser[]
    }

    public async findByRoleId(roleId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        user.username,
                        user_role_mx.userid,
                        user_role_mx.roleId,
                        user_role_mx.creater,
                        user_role_mx.createdAt
                     FROM
                        user_role_mx
                        INNER JOIN user on user.userid = user_role_mx.userid
                     WHERE
                        user_role_mx.roleId = ?`;
        const [res] = await conn.query(sql, [roleId]);
        return res as IUserRoleMxJoinUser[]
    }

    public async isExist(roleId:number,userId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        user_role_mx.userid,
                        user_role_mx.roleId,
                        user_role_mx.creater,
                        user_role_mx.createdAt
                     FROM
                        user_role_mx
                     WHERE
                        user_role_mx.userid = ?
                        AND user_role_mx.roleId = ?`;
        const [res] = await conn.query(sql, [
            userId,
            roleId,
        ]);
        return !((res as IUserRoleMx[]).length > 0);
    }

    public async findOne(userRoleMx: IUserRoleMx) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        user_role_mx.userid,
                        user_role_mx.roleId,
                        user_role_mx.creater,
                        user_role_mx.createdAt
                     FROM
                        user_role_mx
                     WHERE
                        user_role_mx.userid = ?
                        AND user_role_mx.roleId = ?`;
        const [res] = await conn.query(sql, [
            userRoleMx.userid,
            userRoleMx.roleId,
        ]);
        if((res as IUserRoleMx[]).length>0){
            return (res as IUserRoleMx[])[0]
        }else{
            return Promise.reject(new Error('查询用户单个角色明细失败'))
        }
    }

    public async create(userRoleMx: IUserRoleMx) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO user_role_mx (
                        user_role_mx.userid,
                        user_role_mx.roleId,
                        user_role_mx.creater,
                        user_role_mx.createdAt
                      ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            userRoleMx.userid,
            userRoleMx.roleId,
            userRoleMx.creater,
            userRoleMx.createdAt
        ]]]);

        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('新增用户角色明细失败'))
        }
    }

    public async delete_data(userRoleMx: IUserRoleMx) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM
                        user_role_mx
                     WHERE
                        user_role_mx.userid = ?
                        AND user_role_mx.roleId = ?
        `;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            userRoleMx.userid,
            userRoleMx.roleId
        ]);

        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('删除用户角色明细失败'))
        }
    }

}