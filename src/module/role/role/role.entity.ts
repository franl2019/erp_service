import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {IRole} from "./role";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class RoleEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findAll() {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                         role.roleId,
                         role.roleName,
                         role.printid,
                         role.useflag,
                         role.useflagDate,
                         role.creater,
                         role.createdAt,
                         role.updater,
                         role.updatedAt,
                         role.level1Review,
                         role.level1Name,
                         role.level1Date,
                         role.level2Review,
                         role.level2Name,
                         role.level2Date,
                         role.del_uuid,
                         role.deleter,
                         role.deletedAt
                     FROM
                         role`;
        const [res] = await conn.query(sql);
        return (res as IRole[])
    }

    public async findOne(roleId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                         role.roleId,
                         role.roleName,
                         role.printid,
                         role.useflag,
                         role.useflagDate,
                         role.creater,
                         role.createdAt,
                         role.updater,
                         role.updatedAt,
                         role.level1Review,
                         role.level1Name,
                         role.level1Date,
                         role.level2Review,
                         role.level2Name,
                         role.level2Date,
                         role.del_uuid,
                         role.deleter,
                         role.deletedAt
                     FROM
                         role
                        
                     WHERE
                         role.roleId = ?   
                         `;
        const [res] = await conn.query(sql, [roleId]);
        if ((res as IRole[]).length > 0) {
            return (res as IRole[])[0]
        } else {
            return Promise.reject(new Error('查询单个角色主题失败'))
        }
    }

    public async create(role: IRole) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO role (
                         role.roleName,
                         role.printid,
                         role.useflag,
                         role.useflagDate,
                         role.creater,
                         role.createdAt
                      ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            role.roleName,
            role.printid,
            role.useflag,
            role.useflagDate,
            role.creater,
            role.createdAt
        ]]]);

        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('新增角色主题失败'));
        }
    }

    public async update(role: IRole) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        role
                     SET
                        role.roleName = ?,
                        role.printid = ?,
                        role.useflag = ?,
                        role.useflagDate = ?,
                        role.updater = ?,
                        role.updatedAt = ?
                     WHERE
                        role.roleId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            role.roleName,
            role.printid,
            role.useflag,
            role.useflagDate,
            role.updater,
            role.updatedAt,
            role.roleId
        ]);
        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('更新角色主题失败'))
        }
    }

    public async delete_data(roleId:number,userName:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        role
                     SET
                        role.del_uuid = ?,
                        role.deleter = ?,
                        role.deletedAt = ?
                     WHERE
                        role.roleId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            roleId,
            userName,
            new Date(),
            roleId
        ]);
        if(res.affectedRows>0){
            return res
        }else{
            return Promise.reject(new Error('更新角色主题删除标记失败'))
        }
    }
}