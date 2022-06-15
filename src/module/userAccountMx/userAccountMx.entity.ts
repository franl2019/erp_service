import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IUserAccountMx, IUserAccountMxFind} from "./userAccountMx";
import {ResultSetHeader} from "mysql2/promise";
import {UserAccountAuthFindDto} from "./dto/userAccountAuthFind.dto";

@Injectable()
export class UserAccountMxEntity {

    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async findOne(accountId: number, userid: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        user_account_mx.userid, 
                        user_account_mx.accountId, 
                        user_account_mx.creater, 
                        user_account_mx.createdAt, 
                        user_account_mx.updater, 
                        user_account_mx.updatedAt
                     FROM
                        user_account_mx
                     WHERE 
                        user_account_mx.userid = ?
                        AND user_account_mx.accountId = ?`;
        const [res] = await conn.query(sql, [userid, accountId])
        return (res as IUserAccountMx[])[0]
    }

    public async find(findDto: UserAccountAuthFindDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                        user_account_mx.userid, 
                        user_account_mx.accountId, 
                        user_account_mx.creater, 
                        user_account_mx.createdAt, 
                        user_account_mx.updater, 
                        user_account_mx.updatedAt,
                        account.accountName
                     FROM
                        user_account_mx
                        INNER JOIN account ON user_account_mx.accountId = account.accountId
                     WHERE 
                        user_account_mx.userid = ?`
        const params = [];
        params.push(findDto.userid)
        if (findDto.accountId) {
            sql = sql + ` AND user_account_mx.accountId = ?`;
            params.push(findDto.accountId)
        }
        const [res] = await conn.query(sql, params)
        if ((res as IUserAccountMxFind[]).length > 0) {
            return (res as IUserAccountMxFind[])
        } else {
            return [];
        }
    }

    public async create(userAccountMx: IUserAccountMx[]) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO user_account_mx (
                        user_account_mx.userid, 
                        user_account_mx.accountId, 
                        user_account_mx.creater, 
                        user_account_mx.createdAt
                ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [userAccountMx.map(user_account_mx => [
            user_account_mx.userid,
            user_account_mx.accountId,
            user_account_mx.creater,
            user_account_mx.createdAt
        ])]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject("新增用户出纳账户权限失败");
        }
    }

    public async delete_data(userid:number,accountId:number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM user_account_mx WHERE user_account_mx.userid = ? AND user_account_mx.accountId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [userid, accountId]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject("删除用户出纳账户权限失败")
        }
    }
}