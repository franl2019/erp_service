import {ResultSetHeader} from "mysql2/promise";
import {IUserNotPassword, User} from "./user";
import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable()
export class UserSql {

    constructor(private readonly mysqldbAls: MysqldbAls) {
    }

    public async findAll() {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                           user.userid,
                           user.usercode,
                           user.username,
                           user.password,
                           user.useflag,
                           user.usertype,
                           user.creater,
                           user.createdAt,
                           user.updater,
                           user.updatedAt,
                           user.del_uuid,
                           user.deletedAt,
                           user.deleter,
                           user.systemConfigHeadId
                         FROM
                          user
                         WHERE
                          user.del_uuid = 0
                         `;
        const [res] = await conn.query(sql);
        return (res as IUserNotPassword[]);
    }

    //在userid查询User
    public async findById(userid: number): Promise<User> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                               user.userid,
                               user.usercode,
                               user.username,
                               user.password,
                               user.useflag,
                               user.usertype,
                               user.creater,
                               user.createdAt,
                               user.updater,
                               user.updatedAt,
                               user.del_uuid,
                               user.deletedAt,
                               user.deleter,
                               user.systemConfigHeadId
                             FROM 
                               user 
                             WHERE 
                               user.userid = ?
                               AND user.del_uuid = 0
                             `;
        const [res] = await conn.query(sql, [userid]);
        if ((res as User[]).length > 0) {
            return (res as User[])[0];
        } else {
            return Promise.reject(new Error("找不到用户"));
        }
    }

    //在usercode查询User
    public async findWithUserCode(usercode: string): Promise<User> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT 
                                 user.userid,
                                 user.usercode,
                                 user.username,
                                 user.password,
                                 user.useflag,
                                 user.usertype,
                                 user.creater,
                                 user.createdAt,
                                 user.updater,
                                 user.updatedAt,
                                 user.del_uuid,
                                 user.deletedAt,
                                 user.deleter,
                                 user.systemConfigHeadId
                               FROM 
                                 user 
                               WHERE 
                                 user.usercode = ?
                                 AND user.del_uuid = 0
                               `;
        const [res] = await conn.query(sql, [usercode]);
        if ((res as User[]).length > 0) {
            return (res as User[])[0];
        } else {
            return Promise.reject(new Error("用户账户错误"));
        }
    }

    //插入User
    public async createUser(user: User) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `INSERT INTO user SET ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, user);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增用户失败"));
        }
    }
}