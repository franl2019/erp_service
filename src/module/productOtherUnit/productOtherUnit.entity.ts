import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IProductOtherUnit} from "./productOtherUnit";
import {ProductOtherUnitCreateDto} from "./dto/productOtherUnitCreate.dto";
import {ResultSetHeader} from "mysql2/promise";
import {ProductOtherUnitUpdateDto} from "./dto/productOtherUnitUpdate.dto";
import {ProductOtherUnitFindDto} from "./dto/productOtherUnitFind.dto";

@Injectable()
export class ProductOtherUnitEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls
    ) {
    }

    public async findOne(productOtherUnitId: number) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
               SELECT
                   product_other_unit.productOtherUnitId,
                   product_other_unit.productOtherUnitName,
                   product_other_unit.defaultConversionRate,
                   product_other_unit.useflag,
                   product_other_unit.useflagDate,
                   product_other_unit.creater,
                   product_other_unit.createdAt,
                   product_other_unit.updater,
                   product_other_unit.updatedAt,
                   product_other_unit.level1Review,
                   product_other_unit.level1Name,
                   product_other_unit.level1Date,
                   product_other_unit.level2Review,
                   product_other_unit.level2Name,
                   product_other_unit.level2Date,
                   product_other_unit.del_uuid,
                   product_other_unit.deleter,
                   product_other_unit.deletedAt
               FROM
                   product_other_unit
               WHERE
                   product_other_unit.productOtherUnitId = ?`;
        const [res] = await conn.query(sql, [productOtherUnitId]);
        if ((res as IProductOtherUnit[]).length > 0) {
            return (res as IProductOtherUnit[])[0]
        } else {
            return Promise.reject(new Error('查询产品辅助单位失败'))
        }
    }

    public async find(findDto:ProductOtherUnitFindDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
               SELECT
                   product_other_unit.productOtherUnitId,
                   product_other_unit.productOtherUnitName,
                   product_other_unit.defaultConversionRate,
                   product_other_unit.useflag,
                   product_other_unit.useflagDate,
                   product_other_unit.creater,
                   product_other_unit.createdAt,
                   product_other_unit.updater,
                   product_other_unit.updatedAt,
                   product_other_unit.level1Review,
                   product_other_unit.level1Name,
                   product_other_unit.level1Date,
                   product_other_unit.level2Review,
                   product_other_unit.level2Name,
                   product_other_unit.level2Date,
                   product_other_unit.del_uuid,
                   product_other_unit.deleter,
                   product_other_unit.deletedAt
               FROM
                   product_other_unit
               WHERE
                   1 = 1
                   ${findDto.productOtherUnitId     ? `AND product_other_unit.productOtherUnitId = ${findDto.productOtherUnitId}`:``}
                   ${findDto.productOtherUnitName   ? `AND product_other_unit.productOtherUnitName = ${findDto.productOtherUnitName}`:``}
                   ${findDto.defaultConversionRate  ? `AND product_other_unit.defaultConversionRate = ${findDto.defaultConversionRate}`:``}
                   ${findDto.useflag                ? `AND product_other_unit.useflag = ${findDto.useflag}`:``}
               `;
        const [res] = await conn.query(sql);
        return (res as IProductOtherUnit[])
    }

    public async create(createDto: ProductOtherUnitCreateDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                INSERT INTO product_other_unit (
                    product_other_unit.productOtherUnitId,
                    product_other_unit.productOtherUnitName,
                    product_other_unit.defaultConversionRate,
                    product_other_unit.useflag,
                    product_other_unit.useflagDate,
                    product_other_unit.creater,
                    product_other_unit.createdAt
                ) VALUES ?
        `;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            createDto.productOtherUnitId,
            createDto.productOtherUnitName,
            createDto.defaultConversionRate,
            createDto.useflag,
            createDto.useflagDate,
            createDto.creater,
            createDto.createdAt
        ]]]);

        if (res.affectedRows > 0) {
            return res
        } else {
            return Promise.reject(new Error('新增产品辅助单位失败'));
        }
    }

    public async update(updateDto: ProductOtherUnitUpdateDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE 
                        product_other_unit 
                     SET
                        product_other_unit.productOtherUnitName = ?,
                        product_other_unit.defaultConversionRate = ?,
                        product_other_unit.useflag = ?,
                        product_other_unit.useflagDate = ?,
                        product_other_unit.updater = ?,
                        product_other_unit.updatedAt = ?
                     WHERE
                        product_other_unit.productOtherUnitId = ?
                     `;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            updateDto.productOtherUnitName,
            updateDto.defaultConversionRate,
            updateDto.useflag,
            updateDto.useflagDate,
            updateDto.updater,
            updateDto.updatedAt,
            updateDto.productOtherUnitId
        ]);

        if(res.affectedRows>0){
            return res;
        }else{
            return Promise.reject(new Error('更新产品辅助单位失败'))
        }
    }

    public async delete_data(productOtherUnitId:number,username:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `
                UPDATE 
                    product_other_unit
                SET
                    product_other_unit.del_uuid = ?,
                    product_other_unit.deleter = ?,
                    product_other_unit.deletedAt = ?
                WHERE
                    product_other_unit.del_uuid = 0
                    AND product_other_unit.productOtherUnitId = ?
        `;

        const [res] = await conn.query<ResultSetHeader>(sql,[
            productOtherUnitId,
            username,
            new Date(),
            productOtherUnitId
        ]);

        if(res.affectedRows > 0){
            return res
        }else{
            return Promise.reject(new Error('删除产品辅助单位失败'));
        }
    }
}