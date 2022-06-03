import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IClientAutoCode} from "./clientAutoCode";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class ClientAutoCodeEntity {

    constructor(
        private readonly mysqldbAls:MysqldbAls
    ) {
    }

    public async findOne(autoCodeName:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT 
                        client_autocode.autoCodeName,
                        client_autocode.autoCodeNumber
                     From
                        client_autocode
                     WHERE
                        client_autocode.autoCodeName = ?`;
        const [res] = await conn.query(sql,[autoCodeName])
        if((res as IClientAutoCode[]).length>0){
            return (res as IClientAutoCode[])[0]
        }else{
            return null
        }
    }

    public async create(clientAutoCode:IClientAutoCode){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO client_autocode (
                        client_autocode.autoCodeName,
                        client_autocode.autoCodeNumber
                    ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[[[
            clientAutoCode.autoCodeName,
            clientAutoCode.autoCodeNumber
        ]]]);
        if(res.affectedRows>0){
            return res;
        }else{
            return Promise.reject(new Error('新增客户资料自动编号失败'))
        }
    }

    public async update(clientAutoCode:IClientAutoCode){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        client_autocode
                     SET
                        client_autocode.autoCodeName = ?,
                        client_autocode.autoCodeNumber = ?
                     WHERE
                        client_autocode.autoCodeName = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            clientAutoCode.autoCodeName,
            clientAutoCode.autoCodeNumber,
            clientAutoCode.autoCodeName,
        ]);
        if(res.affectedRows>0){
            return res;
        }else{
            return Promise.reject(new Error('新增客户资料自动编号失败'))
        }
    }
}