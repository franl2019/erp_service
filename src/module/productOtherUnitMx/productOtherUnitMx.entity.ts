import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IProductOtherUnitMx} from "./productOtherUnitMx";
import {ProductOtherUnitMxCreateDto} from "./dto/productOtherUnitMxCreate.dto";
import {ResultSetHeader} from "mysql2/promise";

@Injectable()
export class ProductOtherUnitMxEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findOne(productid: number,productOtherUnitId:number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        product_other_unit_mx.productid,
                        product_other_unit_mx.productOtherUnitId,
                        product_other_unit_mx.conversionRate,
                        product_other_unit_mx.creater,
                        product_other_unit_mx.createdAt
                     FROM
                        product_other_unit_mx
                     WHERE
                        product_other_unit_mx.productid = ?
                        AND product_other_unit_mx.productOtherUnitId = ?
                     `;
        const [res] = await conn.query(sql, [productid,productOtherUnitId]);
        if((res as IProductOtherUnitMx[]).length>0){
            return (res as IProductOtherUnitMx[])[0]
        }else{
            return Promise.reject(new Error('查询产品辅助单位明细失败'));
        }
    }

    public async find(productid: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `SELECT
                        product_other_unit_mx.productid,
                        product_other_unit_mx.productOtherUnitId,
                        product_other_unit_mx.conversionRate,
                        product_other_unit_mx.creater,
                        product_other_unit_mx.createdAt
                     FROM
                        product_other_unit_mx
                     WHERE
                        product_other_unit_mx.productid = ?
                     `;
        const [res] = await conn.query(sql, [productid]);
        return res as IProductOtherUnitMx[]
    }

    public async create(createDto:ProductOtherUnitMxCreateDto){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `INSERT INTO product_other_unit_mx (
                        product_other_unit_mx.productid,
                        product_other_unit_mx.productOtherUnitId,
                        product_other_unit_mx.conversionRate,
                        product_other_unit_mx.creater,
                        product_other_unit_mx.createdAt
                      ) VALUES ?
        `;
        const [res] = await conn.query<ResultSetHeader>(sql,[[[
            createDto.productid,
            createDto.productOtherUnitId,
            createDto.conversionRate,
            createDto.creater,
            createDto.createdAt
        ]]]);

        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('新增产品辅助单位明细失败'))
        }
    }

    public async delete_data(productid: number,productOtherUnitId:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `DELETE FROM product_other_unit_mx
                     WHERE product_other_unit_mx.productid = ?
                     AND product_other_unit_mx.productOtherUnitId = ?`;

        const [res] = await conn.query<ResultSetHeader>(sql,[productid,productOtherUnitId]);

        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('删除产品辅助单位明细失败'))
        }
    }
}