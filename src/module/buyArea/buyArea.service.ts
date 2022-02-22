import { Injectable } from "@nestjs/common";
import { BuyAreaSql } from "./buyArea.sql";
import { UpdateBuyAreaDto } from "./dto/updateBuyArea.dto";
import { AddBuyAreaDto } from "./dto/addBuyArea.dto";
import { DeleteBuyAreaDto } from "./dto/deleteBuyArea.dto";
import { MysqldbAls } from "../mysqldb/mysqldbAls";

@Injectable()
export class BuyAreaService {

  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly buyAreaSql: BuyAreaSql) {
  }

  public async select() {
    return await this.buyAreaSql.getBuyAreas();
  }

  public async findOne(buyareaid: number) {
    return await this.buyAreaSql.getBuyArea(buyareaid);
  }

  public async unselect() {
    return await this.buyAreaSql.getDeleteBuyAreas();
  }

  public async add(buyArea: AddBuyAreaDto) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      let res;
      // ClientArea.parentid = 0 根地区
      if (buyArea.parentid !== 0) {
        //检查所属地区是否存在
        const parentBuyArea = await this.buyAreaSql.getBuyArea(buyArea.parentid);
        //添加地区
        res = await this.buyAreaSql.add(buyArea);
        //更新父级地区sonflag标记
        await this.buyAreaSql.updateSonflag(parentBuyArea.buyareaid);
      } else {
        //添加地区
        res = await this.buyAreaSql.add(buyArea);
      }
      return res;
    });
  }

  public async update(buyArea: UpdateBuyAreaDto) {
    if (buyArea.buyareaid === buyArea.parentid) {
      return Promise.reject(new Error("所属地区不能于修改地区相同"));
    }
    return await this.mysqldbAls.sqlTransaction(async () => {
      const buyArea_DB = await this.buyAreaSql.getBuyArea(buyArea.buyareaid);
      //检查是否存在下级区域，有下级区域不能修改parentid
      if (buyArea.parentid !== buyArea_DB.parentid) {
        const childrenBuyAreas = await this.buyAreaSql.getChildrenBuyArea(buyArea.buyareaid);
        if (childrenBuyAreas.length > 0) {
          return Promise.reject(new Error("供应商地区下级存在,不能修改类别所属"));
        } else {
          await this.buyAreaSql.update(buyArea);
        }
      } else {
        await this.buyAreaSql.update(buyArea);
      }
      if (buyArea.parentid !== buyArea_DB.parentid && buyArea_DB.parentid !== 0) {
        await this.buyAreaSql.updateSonflag(buyArea_DB.parentid);
      }
      if (buyArea.parentid !== buyArea_DB.parentid && buyArea.parentid !== 0) {
        await this.buyAreaSql.updateSonflag(buyArea.parentid);
      }
    });


  }

  public async delete_data(buyArea: DeleteBuyAreaDto) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      const buyBelongsToBuyAreaList = await this.buyAreaSql.getBuyBelongsToBuyArea(buyArea.buyareaid);
      if (buyBelongsToBuyAreaList.length !== 0) {
        return Promise.reject(new Error("供应商地区下已存在供应商，不能删除"));
      }
      const buyArea_DB = await this.buyAreaSql.getBuyArea(buyArea.buyareaid);
      const childrenBuyAreas = await this.buyAreaSql.getChildrenBuyArea(buyArea.buyareaid);
      if (childrenBuyAreas.length !== 0) {
        return Promise.reject(new Error("供应商地区下级存在,不能删除"));
      }
      await this.buyAreaSql.delete_data(buyArea);
      if (buyArea_DB.parentid !== 0) {
        await this.buyAreaSql.updateSonflag(buyArea_DB.parentid);
      }
    });

  }

  public async undelete(buyArea: DeleteBuyAreaDto) {
    buyArea.del_uuid = 0;
    buyArea.deletedAt = null;
    buyArea.deleter = null;
    return await this.mysqldbAls.sqlTransaction(async () => {
      const buyArea_DB = await this.buyAreaSql.getDeleteBuyArea(buyArea.buyareaid);
      await this.buyAreaSql.undelete(buyArea);
      if (buyArea_DB.parentid !== 0) {
        await this.buyAreaSql.updateSonflag(buyArea_DB.parentid);
      }
    });

  }


}
