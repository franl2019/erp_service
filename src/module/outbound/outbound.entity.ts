import { Injectable } from "@nestjs/common";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { IOutbound } from "./outbound";
import { IFindOutboundDto, IOutboundHead } from "./dto/find.dto";
import { ResultSetHeader } from "mysql2/promise";

@Injectable()
export class OutboundEntity {

  constructor(
    private readonly mysqlAls: MysqldbAls
  ) {
  }

  //出仓单单头 综合查询
  public async find(findDto: IFindOutboundDto): Promise<IOutboundHead[]> {
    const conn = this.mysqlAls.getConnectionInAls();
    let sql = `SELECT
                outbound.outboundid, 
                outbound.outboundcode, 
                outbound.outboundtype, 
                outbound.outdate, 
                outbound.moneytype, 
                outbound.relatednumber, 
                outbound.remark1, 
                outbound.remark2, 
                outbound.remark3, 
                outbound.remark4, 
                outbound.remark5, 
                outbound.printcount, 
                outbound.level1review, 
                outbound.level1name, 
                outbound.level1date, 
                outbound.level2review, 
                outbound.level2name, 
                outbound.level2date, 
                outbound.creater, 
                outbound.createdAt, 
                outbound.updater, 
                outbound.updatedAt, 
                outbound.warehouseid,
                outbound.clientid,
                outbound.del_uuid, 
                outbound.deletedAt, 
                outbound.deleter,
                (
                    SELECT
                        SUM(
                            outbound_mx.priceqty * outbound_mx.netprice
                        )
                    FROM
                        outbound_mx
                    WHERE
                        outbound.outboundid = outbound_mx.outboundid
                ) AS amt,
                client.clientname,
                warehouse.warehousename
              FROM
                outbound
	              INNER JOIN client ON outbound.clientid = client.clientid
	              INNER JOIN warehouse ON outbound.warehouseid = warehouse.warehouseid
              WHERE 
                1 = 1
                AND outbound.del_uuid = 0`;
    let params = [];

    //按仓库查询
    if (findDto.warehouseids.length > 0) {
      sql = sql + ` AND outbound.warehouseid IN (?)`;
      params.push(findDto.warehouseids);
    } else {
      return Promise.reject(new Error("查询出仓单失败，缺少仓库权限ID"));
    }

    //按客户查询
    if (findDto.clientid !== 0) {
      sql = sql + ` AND outbound.clientid IN (?)`;
      params.push([findDto.clientid]);
    }

    //按操作区域查询
    if (findDto.operateareaids.length > 0) {
      sql = sql + ` AND client.operateareaid IN (?)`;
      params.push(findDto.operateareaids);
    } else {
      return Promise.reject(new Error("查询出仓单失败，缺少操作区域权限ID"));
    }

    //按出仓日期范围查询
    if (findDto.startOutDate.length > 0 && findDto.endOutDate.length > 0) {
      sql = sql + ` AND DATE(outbound.outdate) BETWEEN ? AND ?`;
      params.push(findDto.startOutDate, findDto.endOutDate);
    }

    //按id查询
    if (findDto.outboundid !== 0) {
      sql = sql + ` AND outbound.outboundid = ?`;
      params.push(findDto.outboundid);
    }

    //按出仓单编号查询
    if (findDto.outboundcode.length > 0) {
      sql = sql + ` AND outbound.outboundcode LIKE ?`;
      params.push(`%${findDto.outboundcode}%`);
    }

    //按出仓单类型查询
    if (findDto.outboundtype !== 0) {
      sql = sql + ` AND outbound.outboundtype = ?`;
      params.push(findDto.outboundtype);
    }

    //按出仓单相关号码查询
    if (findDto.relatednumber.length > 0) {
      sql = sql + ` AND outbound.relatednumber LIKE ?`;
      params.push(`%${findDto.relatednumber}%`);
    }

    //分页查询
    if (findDto.page >= 0 && findDto.pagesize >=0) {
      sql = sql + ` LIMIT ?,?`;
      params.push(findDto.page, findDto.pagesize);
    }

    const [res] = await conn.query(sql, params);
    return res as IOutboundHead[];
  };

  //查询单个进仓单头
  public async findOne(outboundid: number): Promise<IOutbound> {
    const conn = await this.mysqlAls.getConnectionInAls();
    const sql = `SELECT
                outbound.outboundid, 
                outbound.outboundcode, 
                outbound.outboundtype, 
                outbound.outdate, 
                outbound.moneytype, 
                outbound.relatednumber, 
                outbound.remark1, 
                outbound.remark2, 
                outbound.remark3, 
                outbound.remark4, 
                outbound.remark5, 
                outbound.printcount, 
                outbound.level1review, 
                outbound.level1name, 
                outbound.level1date, 
                outbound.level2review, 
                outbound.level2name, 
                outbound.level2date, 
                outbound.creater, 
                outbound.createdAt, 
                outbound.updater, 
                outbound.updatedAt, 
                outbound.warehouseid,
                outbound.clientid,
                outbound.del_uuid, 
                outbound.deletedAt, 
                outbound.deleter
              FROM
                outbound
	            WHERE
	              outbound.outboundid = ?`;
    const [res] = await conn.query(sql, [outboundid]);
    if ((res as IOutbound[]).length > 0) {
      return (res as IOutbound[])[0];
    } else {
      return Promise.reject(new Error("查询进仓单的单头失败"));
    }
  }

  //新增出仓单的单头
  public async create(outbound: IOutbound) {
    const conn = await this.mysqlAls.getConnectionInAls();
    const sql = `INSERT INTO outbound (
                  outbound.outboundid, 
                  outbound.outboundcode, 
                  outbound.outboundtype, 
                  outbound.outdate, 
                  outbound.moneytype, 
                  outbound.relatednumber, 
                  outbound.remark1, 
                  outbound.remark2, 
                  outbound.remark3, 
                  outbound.remark4, 
                  outbound.remark5, 
                  outbound.printcount, 
                  outbound.level1review, 
                  outbound.level1name, 
                  outbound.level1date, 
                  outbound.level2review, 
                  outbound.level2name, 
                  outbound.level2date, 
                  outbound.creater, 
                  outbound.createdAt, 
                  outbound.updater, 
                  outbound.updatedAt, 
                  outbound.warehouseid,
                  outbound.clientid,
                  outbound.del_uuid, 
                  outbound.deletedAt, 
                  outbound.deleter)
                 VALUES ?`;
    const [res] = await conn.query(sql, [[[
      outbound.outboundid,
      outbound.outboundcode,
      outbound.outboundtype,
      outbound.outdate,
      outbound.moneytype,
      outbound.relatednumber,
      outbound.remark1,
      outbound.remark2,
      outbound.remark3,
      outbound.remark4,
      outbound.remark5,
      outbound.printcount,
      outbound.level1review,
      outbound.level1name,
      outbound.level1date,
      outbound.level2review,
      outbound.level2name,
      outbound.level2date,
      outbound.creater,
      outbound.createdAt,
      outbound.updater,
      outbound.updatedAt,
      outbound.warehouseid,
      outbound.clientid,
      outbound.del_uuid,
      outbound.deletedAt,
      outbound.deleter]]]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("新增出仓单的单头失败"));
    }
  }

  //修改出仓单单头
  public async update(outbound: IOutbound) {
    const conn = await this.mysqlAls.getConnectionInAls();
    const sql = `UPDATE outbound SET ? WHERE outbound.del_uuid = 0 AND outbound.outboundid = ?`;
    const [res] = await conn.query(sql, [outbound, outbound.outboundid]);
    if ((res as ResultSetHeader).affectedRows > 0) {
      return (res as ResultSetHeader);
    } else {
      return Promise.reject(new Error("修改出仓单的单头失败"));
    }
  }
}