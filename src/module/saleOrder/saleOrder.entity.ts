import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {ISaleOrder} from "./saleOrder";
import {SaleOrderFindDto} from "./dto/saleOrderFind.dto";
import {ResultSetHeader} from "mysql2/promise";
import {Injectable} from "@nestjs/common";

@Injectable()
export class SaleOrderEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findOne(saleOrderId: number): Promise<ISaleOrder> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                    SELECT
                        sale_order.saleOrderId,
                        sale_order.saleOrderCode,
                        sale_order.saleOrderState,
                        sale_order.orderDate,
                        sale_order.deliveryDate,
                        sale_order.clientid,
                        sale_order.warehouseid,
                        sale_order.moneytype,
                        sale_order.relatednumber,
                        sale_order.address,
                        sale_order.contact,
                        sale_order.deposit,
                        sale_order.printCount,
                        sale_order.stopReview,
                        sale_order.stopName,
                        sale_order.stopDate,
                        sale_order.manualFinishReview,
                        sale_order.manualFinishName,
                        sale_order.manualFinishDate,
                        sale_order.urgentReview,
                        sale_order.urgentName,
                        sale_order.urgentDate,
                        sale_order.level1Review,
                        sale_order.level1Name,
                        sale_order.level1Date,
                        sale_order.level2Review,
                        sale_order.level2Name,
                        sale_order.level2Date,
                        sale_order.del_uuid,
                        sale_order.deleter,
                        sale_order.deletedAt,
                        sale_order.creater,
                        sale_order.createdAt,
                        sale_order.updater,
                        sale_order.updatedAt,
                        sale_order.remark1,
                        sale_order.remark2,
                        sale_order.remark3,
                        sale_order.remark4,
                        sale_order.remark5
                    FROM
                        sale_order
                    WHERE
                        sale_order.saleOrderId = ?
        `;
        const [res] = await conn.query(sql, [saleOrderId]);
        if ((res as ISaleOrder[]).length > 0) {
            return (res as ISaleOrder[])[0];
        } else {
            return Promise.reject(new Error('查询单个,销售订单单头错误'))
        }

    }

    public async find(findDto: SaleOrderFindDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                    SELECT
                        sale_order.saleOrderId,
                        sale_order.saleOrderCode,
                        sale_order.saleOrderState,
                        sale_order.orderDate,
                        sale_order.deliveryDate,
                        sale_order.clientid,
                        sale_order.warehouseid,
                        sale_order.moneytype,
                        sale_order.relatednumber,
                        sale_order.address,
                        sale_order.contact,
                        sale_order.deposit,
                        sale_order.printCount,
                        sale_order.stopReview,
                        sale_order.stopName,
                        sale_order.stopDate,
                        sale_order.manualFinishReview,
                        sale_order.manualFinishName,
                        sale_order.manualFinishDate,
                        sale_order.urgentReview,
                        sale_order.urgentName,
                        sale_order.urgentDate,
                        sale_order.level1Review,
                        sale_order.level1Name,
                        sale_order.level1Date,
                        sale_order.level2Review,
                        sale_order.level2Name,
                        sale_order.level2Date,
                        sale_order.del_uuid,
                        sale_order.deleter,
                        sale_order.deletedAt,
                        sale_order.creater,
                        sale_order.createdAt,
                        sale_order.updater,
                        sale_order.updatedAt,
                        sale_order.remark1,
                        sale_order.remark2,
                        sale_order.remark3,
                        sale_order.remark4,
                        sale_order.remark5,
                        client.clientcode,
                        client.clientname,
                        client.ymrep
                    FROM
                        sale_order
                        INNER JOIN client ON client.clientid = sale_order.clientid
                    WHERE
                        1 = 1
                        ${ findDto.saleOrderId           ? ` AND sale_order.saleOrderId = ${conn.escape(findDto.saleOrderId)}` :`` }
                        ${ findDto.saleOrderState        ? ` AND sale_order.saleOrderState = ${conn.escape(findDto.saleOrderState)}` :`` }
                        ${ findDto.clientid              ? ` AND sale_order.clientid = ${conn.escape(findDto.clientid)}` :`` }
                        
                        ${ findDto.clientname.length>0   ? ` AND client.clientname LIKE ${conn.escape(findDto.clientname+'%')}` :`` }
                        ${ findDto.ymrep.length>0        ? ` AND client.ymrep = ${conn.escape(findDto.ymrep)}` :`` }
                        ${ findDto.moneytype.length>0    ? ` AND sale_order.moneytype = ${conn.escape(findDto.moneytype)}` :`` }
                        ${ findDto.relatednumber.length>0? ` AND sale_order.relatednumber = ${conn.escape(findDto.relatednumber)}` :`` }
                        
                        ${ findDto.deposit               ? ` AND sale_order.deposit = ${conn.escape(findDto.deposit)}` :`` }
                        
                        ${ findDto.stopReview            ? ` AND sale_order.stopReview = ${conn.escape(findDto.stopReview)}` :`` }
                        ${ findDto.manualFinishReview    ? ` AND sale_order.manualFinishReview = ${conn.escape(findDto.manualFinishReview)}` :`` }
                        ${ findDto.urgentReview          ? ` AND sale_order.urgentReview = ${conn.escape(findDto.urgentReview)}` :`` }
                        ${ findDto.level1Review          ? ` AND sale_order.level1Review = ${conn.escape(findDto.level1Review)}` :`` }
                        ${ findDto.level2Review          ? ` AND sale_order.level2Review = ${conn.escape(findDto.level2Review)}` :`` }
                        ${ findDto.remark1.length>0          ? ` AND sale_order.remark1 = ${conn.escape(findDto.remark1)}` :`` }
                        ${ findDto.remark2.length>0          ? ` AND sale_order.remark2 = ${conn.escape(findDto.remark2)}` :`` }
                        ${ findDto.remark3.length>0          ? ` AND sale_order.remark3 = ${conn.escape(findDto.remark3)}` :`` }
                        ${ findDto.remark4.length>0          ? ` AND sale_order.remark4 = ${conn.escape(findDto.remark4)}` :`` }
                        ${ findDto.remark5.length>0          ? ` AND sale_order.remark5 = ${conn.escape(findDto.remark5)}` :`` }
                        ${findDto.startDate.length>0 && findDto.endDate.length>0 ? 
                          ` AND DATE(sale_order.orderDate) BETWEEN  ${conn.escape(findDto.startDate)} AND ${conn.escape(findDto.endDate)}`:
                          ``}
                        ${ findDto.deliveryDate.length>0 ? ` AND DATE(sale_order.deliveryDate) = ${conn.escape(findDto.deliveryDate)}` :`` }
        `;
        console.log(sql)
        const [res] = await conn.query(sql);
        return res as ISaleOrder[]
    }

    public async create(saleOrder: ISaleOrder) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO sale_order (
                        sale_order.saleOrderCode,
                        sale_order.orderDate,
                        sale_order.deliveryDate,
                        sale_order.clientid,
                        sale_order.warehouseid,
                        sale_order.moneytype,
                        sale_order.relatednumber,
                        sale_order.address,
                        sale_order.contact,
                        sale_order.deposit,
                        sale_order.creater,
                        sale_order.createdAt,
                        sale_order.remark1,
                        sale_order.remark2,
                        sale_order.remark3,
                        sale_order.remark4,
                        sale_order.remark5
                      ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            saleOrder.saleOrderCode,
            saleOrder.orderDate,
            saleOrder.deliveryDate || null,
            saleOrder.clientid,
            saleOrder.warehouseid,
            saleOrder.moneytype,
            saleOrder.relatednumber,
            saleOrder.address,
            saleOrder.contact,
            saleOrder.deposit,
            saleOrder.creater,
            saleOrder.createdAt,
            saleOrder.remark1,
            saleOrder.remark2,
            saleOrder.remark3,
            saleOrder.remark4,
            saleOrder.remark5,
        ]]]);

        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('新增销售订单单头失败'))
        }
    }

    public async update(saleOrder: ISaleOrder) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        sale_order
                     SET
                        sale_order.orderDate = ?,
                        sale_order.deliveryDate = ?,
                        sale_order.clientid = ?,
                        sale_order.warehouseid = ?,
                        sale_order.moneytype = ?,
                        sale_order.relatednumber = ?,
                        sale_order.address = ?,
                        sale_order.contact = ?,
                        sale_order.deposit = ?,
                        sale_order.updater = ?,
                        sale_order.updatedAt = ?,
                        sale_order.remark1 = ?,
                        sale_order.remark2 = ?,
                        sale_order.remark3 = ?,
                        sale_order.remark4 = ?,
                        sale_order.remark5 = ?
                     WHERE
                        sale_order.saleOrder = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            saleOrder.orderDate,
            saleOrder.deliveryDate || null,
            saleOrder.clientid,
            saleOrder.warehouseid,
            saleOrder.moneytype,
            saleOrder.relatednumber,
            saleOrder.address,
            saleOrder.contact,
            saleOrder.deposit,
            saleOrder.updater,
            saleOrder.updatedAt,
            saleOrder.saleOrderId,
            saleOrder.remark1,
            saleOrder.remark2,
            saleOrder.remark3,
            saleOrder.remark4,
            saleOrder.remark5,
        ]);

        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('更新销售订单单头失败'));
        }
    }

    public async l1Review(saleOrderId:number,username:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                   UPDATE 
                        sale_order
                   SET
                        sale_order.level1Review = 1,
                        sale_order.level1Name = ?,
                        sale_order.level1Date = ?
                   WHERE
                        sale_order.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            username,
            new Date(),
            saleOrderId
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('销售订单审核标记更新失败'))
        }
    }

    public async unl1Review(saleOrderId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                   UPDATE 
                        sale_order
                   SET
                        sale_order.level1Review = 0,
                        sale_order.level1Name = '',
                        sale_order.level1Date = ''
                   WHERE
                        sale_order.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            saleOrderId
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('销售订单撤销审核标记更新失败'))
        }
    }

    public async l2Review(saleOrderId:number,username:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                   UPDATE 
                        sale_order
                   SET
                        sale_order.level2Review = 1,
                        sale_order.level2Name = ?,
                        sale_order.level2Date = ?
                   WHERE
                        sale_order.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            username,
            new Date(),
            saleOrderId
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('销售订单财务审核标记更新失败'))
        }
    }

    public async unl2Review(saleOrderId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                   UPDATE 
                        sale_order
                   SET
                        sale_order.level2Review = 0,
                        sale_order.level2Name = '',
                        sale_order.level2Date = ''
                   WHERE
                        sale_order.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            saleOrderId
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('销售订单撤销财务审核标记更新失败'))
        }
    }

    //终止审核
    public async stopReview(saleOrderId:number,username:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                   UPDATE 
                        sale_order
                   SET
                        sale_order.stopReview = 1,
                        sale_order.stopName = ?,
                        sale_order.stopDate = ?
                   WHERE
                        sale_order.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            username,
            new Date(),
            saleOrderId
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('销售订单,终止审核标记,更新失败'))
        }
    }

    public async unStopReview(saleOrderId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                   UPDATE 
                        sale_order
                   SET
                        sale_order.stopReview = 0,
                        sale_order.stopName = '',
                        sale_order.stopDate = ''
                   WHERE
                        sale_order.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            saleOrderId
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('销售订单,撤销终止审核标记,更新失败'))
        }
    }

    //手动完成
    public async manualFinishReview(saleOrderId:number,username:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                   UPDATE 
                        sale_order
                   SET
                        sale_order.manualFinishReview = 1,
                        sale_order.manualFinishName = ?,
                        sale_order.manualFinishDate = ?
                   WHERE
                        sale_order.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            username,
            new Date(),
            saleOrderId
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('销售订单,手动完成标记,更新失败'))
        }
    }

    public async unManualFinishReview(saleOrderId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                   UPDATE 
                        sale_order
                   SET
                        sale_order.manualFinishReview = 0,
                        sale_order.manualFinishName = '',
                        sale_order.manualFinishDate = ''
                   WHERE
                        sale_order.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            saleOrderId
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('销售订单,撤销手动完成标记,更新失败'))
        }
    }

    //加急
    public async urgentReview(saleOrderId:number,username:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                   UPDATE 
                        sale_order
                   SET
                        sale_order.urgentReview = 1,
                        sale_order.urgentName = ?,
                        sale_order.urgentDate = ?
                   WHERE
                        sale_order.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            username,
            new Date(),
            saleOrderId
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('销售订单,加急标记,审核更新失败'))
        }
    }

    public async unUrgentReview(saleOrderId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                   UPDATE 
                        sale_order
                   SET
                        sale_order.urgentReview = 0,
                        sale_order.urgentName = '',
                        sale_order.urgentDate = ''
                   WHERE
                        sale_order.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            saleOrderId
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('销售订单,加急标记,撤销审核更新失败'))
        }
    }

    //加急
    public async delete_data(saleOrderId:number,username:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                   UPDATE 
                        sale_order
                   SET
                        sale_order.del_uuid = ?,
                        sale_order.deleter = ?,
                        sale_order.deletedAt = ?
                   WHERE
                        sale_order.saleOrderId = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            saleOrderId,
            username,
            new Date(),
            saleOrderId
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('销售订单删除失败'))
        }
    }
}