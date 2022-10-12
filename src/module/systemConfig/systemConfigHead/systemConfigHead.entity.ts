import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {ISystemConfigHead} from "./systemConfigHead";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class SystemConfigHeadEntity {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async findAll(){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        system_config_head.systemConfigHeadId,
                        system_config_head.systemConfigName,
                        system_config_head.creater,
                        system_config_head.createdAt,
                        system_config_head.updater,
                        system_config_head.updatedAt,
                        system_config_head.del_uuid,
                        system_config_head.deleter,
                        system_config_head.deletedAt
                     FROM
                        system_config_head`;
        const [res] = await conn.query(sql);
        if((res as ISystemConfigHead[]).length>0){
            return res as ISystemConfigHead[]
        }else{
            return Promise.reject(new Error('查询全部账套单头失败'))
        }
    }

    public async findById(systemConfigHeadId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        system_config_head.systemConfigHeadId,
                        system_config_head.systemConfigName,
                        system_config_head.creater,
                        system_config_head.createdAt,
                        system_config_head.updater,
                        system_config_head.updatedAt,
                        system_config_head.del_uuid,
                        system_config_head.deleter,
                        system_config_head.deletedAt
                     FROM
                        system_config_head
                     WHERE
                        system_config_head.systemConfigHeadId = ?
                     `;
        const [res] = await conn.query(sql,[systemConfigHeadId]);
        if((res as ISystemConfigHead[]).length>0){
            return (res as ISystemConfigHead[])[0]
        }else{
            return Promise.reject(new Error('查询账套单头失败'))
        }
    }

    public async create(systemConfigHead:ISystemConfigHead,username:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO system_config_head (
                        system_config_head.systemConfigName,
                        system_config_head.creater,
                        system_config_head.createdAt
                      ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[[[
            systemConfigHead.systemConfigName,
            username,
            new Date(),
        ]]]);
        if(res.affectedRows>0){
            return res
        }else{
            return Promise.reject(new Error('新增账套单头失败'));
        }
    }

    public async update(systemConfigHead:ISystemConfigHead,username:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        system_config_head 
                     SET
                        system_config_head.systemConfigName = ?,
                        system_config_head.updater = ?,
                        system_config_head.updatedAt = ?
                     FROM
                        system_config_head.del_uuid = 0
                        AND system_config_head.systemConfigHeadId = ?
                     `;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            systemConfigHead.systemConfigName,
            username,
            new Date(),
            systemConfigHead.systemConfigHeadId
        ]);
        if(res.affectedRows>0){
            return res
        }else{
            return Promise.reject(new Error('更新账套单头失败'));
        }
    }

    public async delete_data(systemConfigHeadId:number,userName:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        system_config_head.del_uuid = ?,
                        system_config_head.deleter = ?,
                        system_config_head.deletedAt = ?
                     FROM
                        system_config_head
                     WHERE
                        system_config_head.del_uuid = 0
                        AND system_config_head.systemConfigHeadId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            systemConfigHeadId,
            userName,
            new Date(),
            systemConfigHeadId
        ]);
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('更新账套单头删除标记失败'));
        }

    }
}