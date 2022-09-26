import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IRolePermissionsMx} from "./rolePermissionsMx";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class RolePermissionsMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findAll(roleId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        role_permissions_mx.roleId,
                        role_permissions_mx.permissionsId,
                        role_permissions_mx.updater,
                        role_permissions_mx.updatedAt
                     FROM
                        role_permissions_mx
                     WHERE
                        role_permissions_mx.roleId = ?`;
        const [res] = await conn.query(sql, [roleId]);
        return (res as IRolePermissionsMx[])
    }

    public async findOne(roleId: number, permissionsId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        role_permissions_mx.roleId,
                        role_permissions_mx.permissionsId,
                        role_permissions_mx.updater,
                        role_permissions_mx.updatedAt
                     FROM
                        role_permissions_mx
                     WHERE
                        role_permissions_mx.roleId = ?
                        AND role_permissions_mx.permissionsId = ?`;
        const [res] = await conn.query(sql, [roleId, permissionsId]);
        if ((res as IRolePermissionsMx[]).length > 0) {
            return (res as IRolePermissionsMx[])
        } else {
            return Promise.reject(new Error('查询单个角色权限错误'))
        }
    }

    public async create(rolePermissionsMx: IRolePermissionsMx) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO role_permissions_mx (
                        role_permissions_mx.roleId,
                        role_permissions_mx.permissionsId,
                        role_permissions_mx.updater,
                        role_permissions_mx.updatedAt
                    ) VALUE ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            rolePermissionsMx.roleId,
            rolePermissionsMx.permissionsId,
            rolePermissionsMx.updater,
            rolePermissionsMx.updatedAt
        ]]]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('新增角色权限失败'));
        }
    }

    public async delete_data(rolePermissionsMx: IRolePermissionsMx) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM
                        role_permissions_mx
                     WHERE
                         role_permissions_mx.roleId = ?
                         AND role_permissions_mx.permissionsId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            rolePermissionsMx.roleId,
            rolePermissionsMx.permissionsId
        ]);

        if ((res.affectedRows > 0)) {
            return res;
        } else {
            return Promise.reject(new Error('删除角色权限失败'))
        }
    }
}