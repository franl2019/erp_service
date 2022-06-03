import {ResultSetHeader} from "mysql2/promise";
import {Product} from "./product";
import {SelectProductDto} from "./dto/selectProduct.dto";
import {AddProductDto} from "./dto/addProduct.dto";
import {UpdateProductDto} from "./dto/updateProduct.dto";
import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {ProductAreaService} from "../productArea/productArea.service";

@Injectable()
export class ProductEntity {
    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly productAreaService:ProductAreaService
    ) {
    }

    public async findOne(productId: number): Promise<Product> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `SELECT
                                product.productid,
                                product.productcode,
                                product.productname,
                                product.materials,
                                product.spec,
                                product.unit,
                                product.packunit,
                                product.packqty,
                                product.m3,
                                product.length,
                                product.width,
                                product.height,
                                product.remark1,
                                product.remark2,
                                product.remark3,
                                product.remark4,
                                product.remark5,
                                product.remark6,
                                product.remark7,
                                product.remark8,
                                product.remark9,
                                product.remark10,
                                product.useflag,
                                product.level1review,
                                product.level1name,
                                product.level1date,
                                product.level2review,
                                product.level2name,
                                product.level2date,
                                product.creater,
                                product.createdAt,
                                product.updater,
                                product.updatedAt,
                                product.productareaid,
                                product.warehouseid,
                                product.del_uuid,
                                product.deletedAt,
                                product.deleter
                            FROM 
                                product 
                            WHERE 
                                product.del_uuid = 0 
                                AND product.productid = ?`;
        const [res] = await conn.query(sql, [productId]);
        if ((res as Product[]).length > 0) {
            return (res as Product[])[0];
        } else {
            return Promise.reject(new Error("找不到单个产品资料"));
        }
    }

    public async find(product: SelectProductDto): Promise<Product[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql: string = `SELECT
                                product.productid,
                                product.productcode,
                                product.productname,
                                product.materials,
                                product.spec,
                                product.unit,
                                product.packunit,
                                product.packqty,
                                product.m3,
                                product.length,
                                product.width,
                                product.height,
                                product.remark1,
                                product.remark2,
                                product.remark3,
                                product.remark4,
                                product.remark5,
                                product.remark6,
                                product.remark7,
                                product.remark8,
                                product.remark9,
                                product.remark10,
                                product.useflag,
                                product.level1review,
                                product.level1name,
                                product.level1date,
                                product.level2review,
                                product.level2name,
                                product.level2date,
                                product.creater,
                                product.createdAt,
                                product.updater,
                                product.updatedAt,
                                product.productareaid,
                                product.warehouseid,
                                product.del_uuid,
                                product.deletedAt,
                                product.deleter
                            FROM
                                product 
                            WHERE 
                                product.del_uuid = 0`;
        let param = [];

        if (product.warehouseids.length > 0) {
            sql = sql + ` AND product.warehouseid in (?)`
            param.push(product.warehouseids);
        } else {
            sql = sql + ` AND product.warehouseid in (?)`
            param.push([0]);
        }

        if (product.productareaid && product.productareaid !== 0) {
            sql = sql + ` AND productareaid IN (?)`;
            const productArea = await this.productAreaService.findOne(product.productareaid);
            const childIdList = await this.productAreaService.getChildIdList(productArea)
            param.push(childIdList);
        }

        if (product.useflag !== null) {
            sql = sql + ` AND product.useflag = ?`;
            param.push(product.useflag);
        }

        if (product.search) {
            sql = sql + ` AND (productcode LIKE ? OR productname LIKE ?)`;
            param.push(`%${product.search}%`, `%${product.search}%`);
        }

        if (product.page && product.pagesize) {
            sql = sql + ` LIMIT ?,?`;
            param.push(product.page, product.pagesize);
        }
        const [res] = await conn.query(sql, param);
        return (res as Product[]);
    }

    public async create(product: AddProductDto): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `INSERT INTO product (
                                product.productid,
                                product.productcode,
                                product.productname,
                                product.materials,
                                product.spec,
                                product.unit,
                                product.packunit,
                                product.packqty,
                                product.m3,
                                product.length,
                                product.width,
                                product.height,
                                product.remark1,
                                product.remark2,
                                product.remark3,
                                product.remark4,
                                product.remark5,
                                product.remark6,
                                product.remark7,
                                product.remark8,
                                product.remark9,
                                product.remark10,
                                product.useflag,
                                product.creater,
                                product.createdAt,
                                product.productareaid,
                                product.warehouseid
                        ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            product.productid,
            product.productcode,
            product.productname,
            product.materials,
            product.spec,
            product.unit,
            product.packunit,
            product.packqty,
            product.m3,
            product.length,
            product.width,
            product.height,
            product.remark1,
            product.remark2,
            product.remark3,
            product.remark4,
            product.remark5,
            product.remark6,
            product.remark7,
            product.remark8,
            product.remark9,
            product.remark10,
            product.useflag,
            product.creater,
            product.createdAt,
            product.productareaid,
            product.warehouseid
        ]]]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增产品资料失败"));
        }
    }

    public async update(product: UpdateProductDto): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE
                                product
                             SET 
                                product.productcode = ?,
                                product.productname = ?,
                                product.materials = ?,
                                product.spec = ?,
                                product.unit = ?,
                                product.packunit = ?,
                                product.packqty = ?,
                                product.m3 = ?,
                                product.length = ?,
                                product.width = ?,
                                product.height = ?,
                                product.remark1 = ?,
                                product.remark2 = ?,
                                product.remark3 = ?,
                                product.remark4 = ?,
                                product.remark5 = ?,
                                product.remark6 = ?,
                                product.remark7 = ?,
                                product.remark8 = ?,
                                product.remark9 = ?,
                                product.remark10 = ?,
                                product.useflag = ?,
                                product.updater = ?,
                                product.updatedAt = ?,
                                product.productareaid = ?,
                                product.warehouseid = ?
                             WHERE 
                                product.productid = ?
                                AND product.level1review = 0
                                AND product.level2review = 0`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            product.productcode,
            product.productname,
            product.materials,
            product.spec,
            product.unit,
            product.packunit,
            product.packqty,
            product.m3,
            product.length,
            product.width,
            product.height,
            product.remark1,
            product.remark2,
            product.remark3,
            product.remark4,
            product.remark5,
            product.remark6,
            product.remark7,
            product.remark8,
            product.remark9,
            product.remark10,
            product.useflag,
            product.updater,
            product.updatedAt,
            product.productareaid,
            product.warehouseid,
            product.productid
        ]);

        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新产品资料失败"));
        }
    }

    public async delete_data(productid:number,userName:string): Promise<ResultSetHeader> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `UPDATE 
                                product
                             SET 
                                product.del_uuid = ?,
                                product.deletedAt = ?,
                                product.deleter = ?
                             WHERE 
                                product.productid = ?
                                AND product.del_uuid = 0
                                AND product.level1review = 0
                                AND product.level2review = 0`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            productid,
            new Date(),
            userName,
            productid
            ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新删除产品资料标记失败"));
        }
    }

    public async l1Review(productid:number,userName:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        product
                     SET
                        product.level1review = 1,
                        product.level1name = ?,
                        product.level1date = ?
                     WHERE
                        product.productid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            userName,
            new Date(),
            productid
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('更新产品审核标记失败'));
        }
    }

    public async unl1Review(productid:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        product
                     SET
                        product.level1review = 0,
                        product.level1name = '',
                        product.level1date = ''
                     WHERE
                        product.productid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            productid
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('更新产品撤审标记失败'));
        }
    }

    public async l2Review(productid:number,userName:string){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        product
                     SET
                        product.level2review = 1,
                        product.level2name = ?,
                        product.level2date = ?
                     WHERE
                        product.productid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            userName,
            new Date(),
            productid
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('更新产品财务审核标记失败'));
        }
    }

    public async unl2Review(productid:number){
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql = `UPDATE
                        product
                     SET
                        product.level2review = 0,
                        product.level2name = '',
                        product.level2date = ''
                     WHERE
                        product.productid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql,[
            productid
        ])
        if(res.affectedRows > 0){
            return res;
        }else{
            return Promise.reject(new Error('更新产品财务撤审标记失败'));
        }
    }
}