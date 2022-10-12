import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {IPermissions} from "./permissions";
import {ResultSetHeader} from "mysql2/promise";
import {PermissionsFindAllDto} from "./dto/permissionsFindAll.dto";

@Injectable()
export class PermissionsEntity {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async findAll(findDto:PermissionsFindAllDto){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                       permissions.permissionsId,
                       permissions.permissionsName,
                       permissions.creater,
                       permissions.createdAt,
                       permissions.updater,
                       permissions.updatedAt,
                       permissions.del_uuid,
                       permissions.deletedAt,
                       permissions.deleter,
                       permissions.permissionsThemeId
                     FROM
                       permissions
                     WHERE
                       permissions.del_uuid = 0
                       ${findDto.permissionsId ? ` AND permissions.permissionsId = ${findDto.permissionsId}`:``}
                       ${findDto.permissionsName.length > 0 ? ` AND permissions.permissionsName = ${findDto.permissionsName}`:``}
                       ${findDto.permissionsThemeId ? ` AND permissions.permissionsThemeId = ${findDto.permissionsThemeId}`:``}
                     `;
        const [res] = await conn.query(sql)
        return res as IPermissions[]
    }

    public async findOne(permissionsId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                       permissions.permissionsId,
                       permissions.permissionsName,
                       permissions.creater,
                       permissions.createdAt,
                       permissions.updater,
                       permissions.updatedAt,
                       permissions.del_uuid,
                       permissions.deletedAt,
                       permissions.deleter,
                       permissions.permissionsThemeId
                     FROM
                       permissions
                     WHERE
                       permissions.permissionsId = ?  
                     `;
        const [res] = await conn.query(sql,[permissionsId]);
        if((res as IPermissions[]).length > 0){
            return (res as IPermissions[])[0]
        }else{
            return Promise.reject(new Error('查询单个权限失败'))
        }
    }

    public async create(permissions:IPermissions){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO permissions (
                       permissions.permissionsName,
                       permissions.creater,
                       permissions.createdAt,
                       permissions.permissionsThemeId
                    ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[[[
            permissions.permissionsName,
            permissions.creater,
            permissions.createdAt,
            permissions.permissionsThemeId
        ]]]);
        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('新增权限资料失败'))
        }
    }

    public async update(permissions:IPermissions){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        permissions
                     SET
                        permissions.permissionsName = ?,
                        permissions.updater = ?,
                        permissions.updatedAt = ?,
                        permissions.permissionsThemeId = ?
                     WHERE
                        permissions.permissionsId = ?
                     `;
        const [res] = await conn.query<ResultSetHeader>(sql,[
           permissions.permissionsName,
           permissions.updater,
           permissions.updatedAt,
           permissions.permissionsThemeId
        ]);

        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('更新权限资料失败'))
        }
    }

    public async delete_data(permissionsId:number,userName:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        permissions
                     SET
                        permissions.del_uuid = ?,
                        permissions.deletedAt = ?,
                        permissions.deleter = ?
                     WHERE
                        permissions.permissionsId = ?
        `;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            permissionsId,
            new Date(),
            userName,
            permissionsId
        ]);
        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('更新产品资料删除标记失败'))
        }
    }
}