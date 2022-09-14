import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {ISystemConfigOptionMx} from "./systemConfigOptionMx";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class SystemConfigOptionMxEntity {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async findAll(systemConfigOptionId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        system_config_option_mx.systemConfigOptionMxId,
                        system_config_option_mx.systemConfigOptionId,
                        system_config_option_mx.systemConfigOptionMxName,
                        system_config_option_mx.reMark
                     FROM
                        system_config_option_mx
                     WHERE
                        system_config_option_mx.systemConfigOptionId = ?`;
        const [res] = await conn.query(sql,[
            systemConfigOptionId
        ]);

        if((res as ISystemConfigOptionMx[]).length > 0){
            return (res as ISystemConfigOptionMx[])
        }else{
            return Promise.reject(new Error('查找全部账套配置项明细失败'))
        }
    }

    public async findOne(systemConfigOptionId:number,systemConfigOptionMxId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        system_config_option_mx.systemConfigOptionMxId,
                        system_config_option_mx.systemConfigOptionId,
                        system_config_option_mx.systemConfigOptionMxName,
                        system_config_option_mx.reMark
                     FROM
                        system_config_option_mx
                     WHERE
                        system_config_option_mx.systemConfigOptionId = ?
                        AND system_config_option_mx.systemConfigOptionMxId = ?`;
        const [res] = await conn.query(sql,[
            systemConfigOptionId,
            systemConfigOptionMxId
        ]);

        if((res as ISystemConfigOptionMx[]).length > 0){
            return (res as ISystemConfigOptionMx[])[0]
        }else{
            return Promise.reject(new Error('查找账套配置项明细失败'))
        }
    }

    public async create(systemConfigOptionMx:ISystemConfigOptionMx){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO system_config_option_mx (
                        system_config_option_mx.systemConfigOptionId,
                        system_config_option_mx.systemConfigOptionMxName,
                        system_config_option_mx.reMark
                     ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[[[
            systemConfigOptionMx.systemConfigOptionId,
            systemConfigOptionMx.systemConfigOptionMxName,
            systemConfigOptionMx.reMark,
        ]]]);

        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('新增账套配置项明细选择失败'))
        }
    }

    public async update(systemConfigOptionMx:ISystemConfigOptionMx){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        system_config_option_mx
                     SET
                        system_config_option_mx.systemConfigOptionId = ?,
                        system_config_option_mx.systemConfigOptionMxName = ?,
                        system_config_option_mx.reMark = ?
                     WHERE
                        system_config_option_mx.systemConfigOptionMxId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            systemConfigOptionMx.systemConfigOptionId,
            systemConfigOptionMx.systemConfigOptionMxName,
            systemConfigOptionMx.reMark
        ])

        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('更新账套配置项明细选择失败'))
        }
    }

    public async delete_data(systemConfigOptionMxId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM
                        system_config_option_mx
                     WHERE
                        system_config_option_mx.systemConfigOptionMxId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            systemConfigOptionMxId
        ]);

        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('删除账套配置项明细选择失败'))
        }
    }
}