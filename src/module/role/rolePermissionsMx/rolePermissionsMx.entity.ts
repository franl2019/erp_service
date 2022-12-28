import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {IRolePermissionsMx} from "./rolePermissionsMx";
import {ResultSetHeader} from "mysql2/promise";
import {IPermissions} from "../../permission/permissions/permissions";
import {RolePermissionsMxFindAllDto} from "./dto/rolePermissionsMxFindAll.dto";

export abstract class IRolePermissionMxJoinPermissions implements IRolePermissionsMx, IPermissions {
    permissionsId: number;
    permissionsCode: string;
    permissionsName: string;
    roleId: number;
    can: number;
    permissionsThemeId: number;
    creater: string;
    createdAt: Date;
    updater: string;
    updatedAt: Date;
    del_uuid: number;
    deleter: string;
    deletedAt: Date;
}

@Injectable()
export class RolePermissionsMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    //can 0 all 1 true 2 false
    public async findAll(rolePermissionsFindDto: RolePermissionsMxFindAllDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
            SELECT
                permissions.permissionsId,
                permissions.permissionsCode,
                permissions.permissionsName,
                permissions.permissionsThemeId,
                IF(ISNULL(role_permissions_mx.permissionsId),0,1) AS can,
                IFNUll(role_permissions_mx.updater,'') as updater,
                IFNUll(role_permissions_mx.updatedAt,null) as updatedAt
            FROM
                permissions
                LEFT JOIN role_permissions_mx ON permissions.permissionsId = role_permissions_mx.permissionsId 
                    AND role_permissions_mx.roleId = ${conn.escape(rolePermissionsFindDto.roleId)}
            WHERE
                permissions.del_uuid = 0
                ${rolePermissionsFindDto.permissionsThemeId?`AND permissions.permissionsThemeId = ${conn.escape(rolePermissionsFindDto.permissionsThemeId)}`:``}
                ${rolePermissionsFindDto.permissionsCode?`AND permissions.permissionsCode = ${conn.escape(rolePermissionsFindDto.permissionsCode)}`:``}
                ${rolePermissionsFindDto.permissionsName?`AND permissions.permissionsName LIKE ${conn.escape(rolePermissionsFindDto.permissionsName+'%')}`:``}
                ${rolePermissionsFindDto.can === 1?`AND role_permissions_mx.permissionsId IS NOT NULL`:``}
                ${rolePermissionsFindDto.can === 0?`AND ISNULL(role_permissions_mx.permissionsId)`:``}
        `;
        //can 字段 在 role_permissions_mx.permissionsId 存在就是有权限
        const [res] = await conn.query(sql);
        return (res as IRolePermissionMxJoinPermissions[])
    }

    public async findByRoleId(roleId: number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        role_permissions_mx.roleId,
                        role_permissions_mx.permissionsId,
                        role_permissions_mx.updater,
                        role_permissions_mx.updatedAt,
                        permissions.permissionsCode,
                        permissions.permissionsName,
                        permissions.permissionsThemeId,
                        1 as can
                     FROM
                        role_permissions_mx
                        INNER JOIN permissions on permissions.permissionsId = role_permissions_mx.permissionsId
                     WHERE
                        role_permissions_mx.roleId = ?`;
        const [res] = await conn.query(sql,[roleId]);
        return res as IRolePermissionMxJoinPermissions[]
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

    public async isExist(roleId: number, permissionsId: number) {
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
        return (res as IRolePermissionsMx[]).length > 0;
    }

    public async create(rolePermissionsMx: IRolePermissionsMx) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO role_permissions_mx (
                        role_permissions_mx.roleId,
                        role_permissions_mx.permissionsId,
                        role_permissions_mx.updater,
                        role_permissions_mx.updatedAt
                    ) VALUES ?`;
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