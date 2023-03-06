import {InventoryFindOneDto} from "./dto/inventoryFindOne.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {Injectable} from "@nestjs/common";
import {InventoryFindDto} from "./dto/inventoryFind.dto";
import {ResultSetHeader} from "mysql2/promise";
import {IFindInventory, Inventory} from "./inventory";
import {InventoryEditDto} from "./dto/inventoryEdit.dto";
import {ClientService} from "../client/client.service";
import {ProductAreaService} from "../productArea/productArea.service";
import {InventoryCreateDto} from "./dto/inventoryCreate.dto";

@Injectable()
export class InventoryEntity {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly clientService: ClientService,
        private readonly productAreaService: ProductAreaService
    ) {
    }

    //查询单个
    public async findOne(findOneDto: InventoryFindOneDto): Promise<Inventory> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT 
                  inventory.inventoryid,
                  inventory.spec_d,
                  inventory.materials_d,
                  inventory.remark,
                  inventory.remarkmx,
                  inventory.updatedAt,
                  inventory.updater,
                  inventory.latest_sale_price,
                  inventory.productid,
                  inventory.clientid,
                  inventory.warehouseid,
                  inventory.qty,
                  inventory.batchNo
              FROM 
                  inventory
              WHERE 
                  inventory.productid = ? 
                  AND inventory.clientid = ? 
                  AND inventory.warehouseid = ? 
                  AND inventory.spec_d = ? 
                  AND inventory.materials_d = ? 
                  AND inventory.remark = ? 
                  AND inventory.remarkmx = ?
                  AND inventory.batchNo = ?
                  `;
        let param = [
            findOneDto.productid,
            findOneDto.clientid,
            findOneDto.warehouseid,
            findOneDto.spec_d,
            findOneDto.materials_d,
            findOneDto.remark,
            findOneDto.remarkmx,
            findOneDto.batchNo
        ];
        const [res] = await conn.query(sql, param);
        if ((res as Inventory[]).length > 0) {
            return (res as Inventory[])[0];
        } else {
            return null;
        }
    }

    //查询库存(带条件)
    public async find(selectDto: InventoryFindDto): Promise<IFindInventory[]> {
        const conn = await this.mysqldbAls.getConnectionInAls();
        let sql = `SELECT
                inventory.inventoryid,
                inventory.spec_d,
                inventory.materials_d,
                inventory.remark,
                inventory.remarkmx,
                inventory.qty,
                inventory.updatedAt,
                inventory.updater,
                inventory.latest_sale_price,
                inventory.clientid,
                inventory.productid,
                inventory.warehouseid,
                inventory.batchNo,
                warehouse.warehousename,
                client.clientcode,
                client.clientname,
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
                product.height
               FROM
                inventory
                INNER JOIN warehouse ON inventory.warehouseid = warehouse.warehouseid
                INNER JOIN client ON inventory.clientid = client.clientid
                INNER JOIN product ON inventory.productid = product.productid 
               WHERE 1=1`;
        let param = [];

        //按仓库查询
        if (selectDto.warehouseids.length > 0) {
            sql = sql + ` AND inventory.warehouseid IN (?) `;
            param.push(selectDto.warehouseids);
        } else {
            return Promise.reject(new Error("查询库存错误，缺少仓库ID条件"));
        }

        //按客户查询 默认查询所有操作区域
        if (selectDto.clientid !== 0) {
            sql = sql + ` AND inventory.clientid IN (?) `;
            const gs = await this.clientService.getGsClient();
            param.push([gs.clientid, selectDto.clientid]);//记得加公司
        }

        //按操作区域查询
        if (selectDto.operateareaids.length > 0) {
            sql = sql + ` AND client.operateareaid IN (?) `;
            param.push(selectDto.operateareaids);
        } else {
            return Promise.reject(new Error("查询库存错误，缺少操作区域ID条件"));
        }

        //按产品类别查询
        if (selectDto.productareaid) {
            sql = sql + ` AND product.productareaid IN (?)`;
            const productArea = await this.productAreaService.findOne(selectDto.productareaid);
            const childIdList = await this.productAreaService.getChildIdList(productArea)
            param.push(childIdList);
        }

        //按产品名称查询
        if (selectDto.productname.length > 0) {
            sql = sql + ` AND product.productname LIKE ?`;
            param.push(`%${selectDto.productname}%`);
        }

        //按产品编号查询
        if (selectDto.productcode.length > 0) {
            sql = sql + ` AND product.productcode LIKE ?`;
            param.push(`%${selectDto.productcode}%`);
        }

        //按产品用料查询
        if (selectDto.materials.length > 0) {
            sql = sql + ` AND product.materials LIKE ?`;
            param.push(`%${selectDto.materials}%`);
        }

        //按产品规格查询
        if (selectDto.spec.length > 0) {
            sql = sql + ` AND product.spec LIKE ?`;
            param.push(`%${selectDto.spec}%`);
        }

        //按产品单位查询
        if (selectDto.unit.length > 0) {
            sql = sql + ` AND product.unit LIKE ?`;
            param.push(`%${selectDto.unit}%`);
        }

        //按库存现用料查询
        if (selectDto.materials_d.length > 0) {
            sql = sql + ` AND inventory.materials_d LIKE ?`;
            param.push(`%${selectDto.materials_d}%`);
        }

        //按库存订造规格查询
        if (selectDto.spec_d.length > 0) {
            sql = sql + ` AND inventory.spec_d LIKE ?`;
            param.push(`%${selectDto.spec_d}%`);
        }

        //按库存备注查询
        if (selectDto.remark.length > 0) {
            sql = sql + ` AND inventory.remark LIKE ?`;
            param.push(`%${selectDto.remark}%`);
        }

        //按库存明细备注查询
        if (selectDto.remarkmx.length > 0) {
            sql = sql + ` AND inventory.remarkmx LIKE ?`;
            param.push(`%${selectDto.remarkmx}%`);
        }

        //按库存批号查询
        if (selectDto.batchNo.length > 0) {
            sql = sql + ` AND inventory.batchNo LIKE ?`;
            param.push(`%${selectDto.batchNo}%`);
        }

        //按useflag 查询是否包含0库存的库存资料，1查询不为零的库存，0查询所有库存资料
        if (selectDto.useflag === 1) {
            sql = sql + ` AND inventory.qty > 0`;
        }

        if (selectDto.page && selectDto.pagesize) {
            sql = sql + ` LIMIT ?,?`;
            param.push(selectDto.page, selectDto.pagesize);
        }
        console.log(sql,param)
        const [res] = await conn.query(sql, param);
        if ((res as IFindInventory[]).length > 0) {
            return (res as IFindInventory[]);
        } else {
            return [];
        }
    }

    public async create(inventory: InventoryCreateDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `INSERT INTO inventory (
                inventory.spec_d,
                inventory.materials_d,
                inventory.remark,
                inventory.remarkmx,
                inventory.qty,
                inventory.updatedAt,
                inventory.updater,
                inventory.latest_sale_price,
                inventory.clientid,
                inventory.productid,
                inventory.warehouseid,
                inventory.batchNo
            ) VALUES ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [[[
            inventory.spec_d,
            inventory.materials_d,
            inventory.remark,
            inventory.remarkmx,
            inventory.qty,
            new Date(),
            inventory.updater,
            inventory.latest_sale_price,
            inventory.clientid,
            inventory.productid,
            inventory.warehouseid,
            inventory.batchNo
        ]]]);
        if (res.affectedRows > 0 && res.insertId !== 0) {
            return res;
        } else {
            return Promise.reject(new Error("新增库存失败"));
        }
    }

    public async update(inventory: InventoryEditDto) {
        const conn = await this.mysqldbAls.getConnectionInAls();
        const sql: string = `
                        UPDATE 
                            inventory 
                        SET 
                            inventory.inventoryid = ?,
                            inventory.spec_d = ?,
                            inventory.materials_d = ?,
                            inventory.remark = ?,
                            inventory.remarkmx = ?,
                            inventory.qty = ?,
                            inventory.updatedAt = ?,
                            inventory.updater = ?,
                            inventory.latest_sale_price = ?,
                            inventory.clientid = ?,
                            inventory.productid = ?,
                            inventory.warehouseid = ?,
                            inventory.batchNo = ?
                        WHERE 
                            inventory.inventoryid = ?`;
        const [res] = await conn.query<ResultSetHeader>(sql, [
            inventory.inventoryid,
            inventory.spec_d,
            inventory.materials_d,
            inventory.remark,
            inventory.remarkmx,
            inventory.qty,
            new Date(),
            inventory.updater,
            inventory.latest_sale_price,
            inventory.clientid,
            inventory.productid,
            inventory.warehouseid,
            inventory.batchNo,
            inventory.inventoryid
        ]);
        if (res.affectedRows > 0) {
            return res;
        } else {
            return Promise.reject(new Error("更新库存失败"));
        }
    }

}