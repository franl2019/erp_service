import {FindOneInventoryDto} from "./dto/findOneInventory.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {Injectable} from "@nestjs/common";
import {FindInventoryDto} from "./dto/findInventory.dto";
import {ResultSetHeader} from "mysql2/promise";
import {IFindInventory, IInventory, Inventory} from "./inventory";
import {AddInventoryDto} from "./dto/addInventory.dto";
import {ClientService} from "../client/client.service";
import {ProductAreaService} from "../productArea/productArea.service";

@Injectable()
export class InventoryEntity {

  constructor(
      private readonly mysqldbAls: MysqldbAls,
      private readonly clientService: ClientService,
      private readonly productAreaService:ProductAreaService
  ) {
  }

  //查询单个
  public async findOne(findOneDto: FindOneInventoryDto): Promise<IInventory> {
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
                  inventory.qty
              FROM 
                  inventory
              WHERE 
                  inventory.productid = ? 
                  AND inventory.clientid = ? 
                  AND inventory.warehouseid = ? 
                  AND inventory.spec_d = ? 
                  AND inventory.materials_d = ? 
                  AND inventory.remark = ? 
                  AND inventory.remarkmx = ?`;
    let param = [findOneDto.productid, findOneDto.clientid, findOneDto.warehouseid, findOneDto.spec_d, findOneDto.materials_d, findOneDto.remark, findOneDto.remarkmx];
    const [res] = await conn.query(sql, param);
    if ((res as IInventory[]).length > 0) {
      return (res as IInventory[])[0];
    } else {
      return null;
    }
  }

  //查询库存(带条件)
  public async find(selectDto: FindInventoryDto): Promise<IFindInventory[]> {
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
      sql = sql + ` AND product.materials_d LIKE ?`;
      param.push(`%${selectDto.materials_d}%`);
    }

    //按库存订造规格查询
    if (selectDto.spec_d.length > 0) {
      sql = sql + ` AND product.spec_d LIKE ?`;
      param.push(`%${selectDto.spec_d}%`);
    }

    //按库存备注查询
    if (selectDto.remark.length > 0) {
      sql = sql + ` AND product.remark LIKE ?`;
      param.push(`%${selectDto.remark}%`);
    }

    //按库存明细备注查询
    if (selectDto.remarkmx.length > 0) {
      sql = sql + ` AND product.remarkmx LIKE ?`;
      param.push(`%${selectDto.remarkmx}%`);
    }

    //按useflag 查询是否包含0库存的库存资料，1查询不为零的库存，0查询所有库存资料
    if (selectDto.useflag === 1) {
      sql = sql + ` AND inventory.qty > 0`;
    }

    if (selectDto.page && selectDto.pagesize) {
      sql = sql + ` LIMIT ?,?`;
      param.push(selectDto.page, selectDto.pagesize);
    }

    const [res] = await conn.query(sql, param);
    if ((res as IFindInventory[]).length > 0) {
      return (res as IFindInventory[]);
    } else {
      return [];
    }
  }

  public async save(addDto: AddInventoryDto) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `INSERT INTO inventory SET ?`;
    const [res] = await conn.query(sql, addDto);
    if ((res as ResultSetHeader).affectedRows > 0 && (res as ResultSetHeader).insertId !== 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增库存失败"));
    }
  }

  public async update(inventory: Inventory) {
    const conn = await this.mysqldbAls.getConnectionInAls();
    const sql: string = `UPDATE inventory SET ? WHERE inventoryid = ?`;
    const [res] = await conn.query(sql, [inventory, inventory.inventoryid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("更新库存失败"));
    }
  }

}