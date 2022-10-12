import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {IPermissionsTheme} from "./permissionsTheme";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class PermissionsThemeEntity {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async findAll(){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                    SELECT
                        permissions_theme.permissionsThemeId,
                        permissions_theme.permissionsThemeName,
                        permissions_theme.printid,
                        permissions_theme.creater,
                        permissions_theme.createdAt,
                        permissions_theme.updater,
                        permissions_theme.updatedAt,
                        permissions_theme.del_uuid,
                        permissions_theme.deleter,
                        permissions_theme.deletedAt
                    FROM
                        permissions_theme
        `;
        const [res] = await conn.query(sql);
        return res as IPermissionsTheme[];
    }

    public async findOne(permissionsThemeId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                    SELECT
                        permissions_theme.permissionsThemeId,
                        permissions_theme.permissionsThemeName,
                        permissions_theme.printid,
                        permissions_theme.creater,
                        permissions_theme.createdAt,
                        permissions_theme.updater,
                        permissions_theme.updatedAt,
                        permissions_theme.del_uuid,
                        permissions_theme.deleter,
                        permissions_theme.deletedAt
                    FROM
                        permissions_theme
                    WHERE
                        permissions_theme.permissionsThemeId = ?
        `;
        const [res] = await conn.query(sql,[
            permissionsThemeId
        ])
        if((res as IPermissionsTheme[]).length > 0){
            return (res as IPermissionsTheme[])[0]
        }else{
            return Promise.reject(new Error('查询权限主题失败'));
        }
    }

    public async create(permissionsTheme:IPermissionsTheme){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                    INSERT INTO permissions_theme (
                        permissions_theme.permissionsThemeId,
                        permissions_theme.permissionsThemeName,
                        permissions_theme.printid,
                        permissions_theme.creater,
                        permissions_theme.createdAt
                    ) VALUES ?
        `;

        const [res] = await conn.query<ResultSetHeader>(sql,[[[
            permissionsTheme.permissionsThemeId,
            permissionsTheme.permissionsThemeName,
            permissionsTheme.printid,
            permissionsTheme.creater,
            permissionsTheme.createdAt
        ]]]);

        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('新增权限主题失败'))
        }
    }

    public async update(permissionsTheme:IPermissionsTheme){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                    UPDATE
                        permissions_theme
                    SET
                        permissions_theme.permissionsThemeName = ?,
                        permissions_theme.updater = ?,
                        permissions_theme.updatedAt = ?
                    WHERE
                        permissions_theme.permissionsThemeId = ?
        `;

        const [res] = await conn.query<ResultSetHeader>(sql,[
            permissionsTheme.permissionsThemeName,
            permissionsTheme.updater,
            permissionsTheme.updatedAt,
            permissionsTheme.permissionsThemeId
        ]);

        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('更新权限主题失败'))
        }
    }

    public async delete_data(permissionsId:number,userName:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        permissions_theme
                     SET
                        permissions_theme.del_uuid = ?,
                        permissions_theme.deleter = ?,
                        permissions_theme.deletedAt = ?
                     WHERE
                        permissions_theme.permissionsThemeId = ?
        `;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            permissionsId,
            userName,
            new Date(),
            permissionsId
        ]);

        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('更新权限主题删除标记失败'))
        }
    }
}