import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {ISystemConfigMx} from "./systemConfigMx";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class SystemConfigMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findOne(systemConfigHeadId: number, systemConfigOptionId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        system_config_mx.systemConfigHeadId,
                        system_config_mx.systemConfigOptionId,
                        system_config_mx.systemConfigOptionMxId,
                        system_config_mx.updater,
                        system_config_mx.updatedAt
                     FROM
                        system_config_mx
                     WHERE
                        system_config_mx.systemConfigHeadId = ?
                        AND system_config_mx.systemConfigOptionId = ?
                     `;
        const [res] = await conn.query(sql, [
            systemConfigHeadId,
            systemConfigOptionId
        ]);
        if ((res as ISystemConfigMx[]).length > 0) {
            return (res as ISystemConfigMx[])[0]
        } else {
            return Promise.reject(new Error('查找单个账套明细失败'))
        }
    }

    public async findAll(systemConfigHeadId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        system_config_mx.systemConfigHeadId,
                        system_config_mx.systemConfigOptionId,
                        system_config_mx.systemConfigOptionMxId,
                        system_config_mx.updater,
                        system_config_mx.updatedAt
                     FROM
                        system_config_mx
                     WHERE
                        system_config_mx.systemConfigHeadId = ?`;
        const [res] = await conn.query(sql, [systemConfigHeadId]);
        if ((res as ISystemConfigMx[]).length > 0) {
            return (res as ISystemConfigMx[])
        } else {
            return Promise.reject(new Error('查找全部账套明细失败'))
        }
    }

    public async create(systemConfigMxList: ISystemConfigMx[]) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO system_config_mx (
                        system_config_mx.systemConfigHeadId,
                        system_config_mx.systemConfigOptionId,
                        system_config_mx.systemConfigOptionMxId,
                        system_config_mx.updater,
                        system_config_mx.updatedAt
                     ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            systemConfigMxList.map((system_config_mx) =>
                [
                    system_config_mx.systemConfigHeadId,
                    system_config_mx.systemConfigOptionId,
                    system_config_mx.systemConfigOptionMxId,
                    system_config_mx.updater,
                    system_config_mx.updatedAt
                ]
            )
        ]);

        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('新增账套明细失败'));
        }
    }

    public async update(systemConfigMx:ISystemConfigMx){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        system_config_mx
                     SET
                        system_config_mx.systemConfigOptionMxId = ?,
                        system_config_mx.updater = ?,
                        system_config_mx.updatedAt = ?
                     WHERE
                        system_config_mx.systemConfigHeadId = ? 
                        AND system_config_mx.systemConfigOptionId = ?
        `;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            systemConfigMx.systemConfigOptionMxId,
            systemConfigMx.updater,
            systemConfigMx.updatedAt,
            systemConfigMx.systemConfigHeadId,
            systemConfigMx.systemConfigOptionId
        ]);

        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('更新账套明细失败'))
        }
    }
}