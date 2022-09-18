import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";
import {ISystemConfigOption} from "./systemConfigOption";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class SystemConfigOptionEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findAll() {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        system_config_option.systemConfigOptionId,
                        system_config_option.systemConfigOptionName,
                        system_config_option.reMark,
                        system_config_option.creater,
                        system_config_option.createdAt,
                        system_config_option.updater,
                        system_config_option.updatedAt,
                        system_config_option.del_uuid,
                        system_config_option.deleter,
                        system_config_option.deletedAt
                     FROM
                        system_config_option`;
        const [res] = await conn.query(sql);
        if ((res as ISystemConfigOption[]).length > 0) {
            return res as ISystemConfigOption[]
        } else {
            return Promise.reject(new Error('缺失账套配置项'))
        }
    }

    public async create(systemConfigOption: ISystemConfigOption) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO system_config_option (
                        system_config_option.systemConfigOptionName,
                        system_config_option.reMark,
                        system_config_option.creater,
                        system_config_option.createdAt
                    ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            systemConfigOption.systemConfigOptionName,
            systemConfigOption.reMark,
            systemConfigOption.creater,
            systemConfigOption.createdAt
        ]]]);

        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('新增账套资料失败'))
        }
    }

    public async update(systemConfigOption: ISystemConfigOption) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        system_config_option
                     SET
                        system_config_option.systemConfigOptionName = ?,
                        system_config_option.reMark = ?,
                        system_config_option.updater = ?,
                        system_config_option.updatedAt = ?
                     WHERE
                        system_config_option.systemConfigOptionId = ?`;

        const [res] = await conn.query<ResultSetHeader>(sql, [
            systemConfigOption.systemConfigOptionName,
            systemConfigOption.reMark,
            systemConfigOption.updater,
            systemConfigOption.updatedAt,
            systemConfigOption.systemConfigOptionId
        ]);

        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('更新账套资料失败'))
        }
    }
}