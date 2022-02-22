import { Injectable } from "@nestjs/common";
import { BuySql } from "./buy.sql";
import { SelectBuyDto } from "./dto/selectBuy.dto";
import { AddBuyDto } from "./dto/addBuy.dto";
import { UpdateBuyDto } from "./dto/updateBuy.dto";
import { DeleteBuyDto } from "./dto/deleteBuy.dto";
import { L1reviewBuyDto } from "./dto/l1reviewBuy.dto";
import { L2reviewDto } from "./dto/l2review.dto";
import { State } from "../../interface/IState";
import { BuyAreaSql } from "../buyArea/buyArea.sql";
import { MysqldbAls } from "../mysqldb/mysqldbAls";


@Injectable()
export class BuyService {

  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly buySql: BuySql,
    private readonly buyAreaSql: BuyAreaSql) {
  }


  public async select(buy: SelectBuyDto, state: State) {
    buy.operateareaids = state.user.buy_operateareaids;
    return await this.buySql.getBuys(buy);
  }

  public async unselect(buy: SelectBuyDto, state: State) {
    buy.operateareaids = state.user.buy_operateareaids;
    return await this.buySql.getDeletedBuys(buy);
  }

  public async add(buy: AddBuyDto, state: State) {
    buy.creater = state.user.username;
    buy.createdAt = new Date();
    if (state.user.buy_operateareaids.indexOf(buy.operateareaid) === -1) {
      await Promise.reject(new Error("缺少该操作区域权限,保存失败"));
    }
    //检查供应商地区是否存在
    await this.buyAreaSql.getBuyArea(buy.buyareaid);
    return await this.buySql.add(buy);
  }

  public async update(buy: UpdateBuyDto, state: State) {
    buy.updater = state.user.username;
    buy.updatedAt = new Date();
    return await this.mysqldbAls.sqlTransaction(async () => {
      const buy_DB = await this.buySql.getBuy(buy.buyid);
      //验证操作区域权限，没有该供应商的操作区域不能修改，更新的操作区域没有权限也不能更新
      if (state.user.buy_operateareaids.indexOf(buy_DB.operateareaid) === -1 || state.user.buy_operateareaids.indexOf(buy.operateareaid) === -1) {
        await Promise.reject(new Error("缺少该操作区域权限,更新失败"));
      }
      //如果没有审核和财审可以修改供应商资料
      if (buy_DB.level1review + buy_DB.level2review === 0) {
        await this.buySql.update(buy);
      } else {
        await Promise.reject(new Error("供应商已审核无法更新保存，请先撤审"));
      }
    });

  }

  public async delete_data(buy: DeleteBuyDto, state: State) {
    buy.del_uuid = buy.buyid;
    buy.deletedAt = new Date();
    buy.deleter = state.user.username;
    return await this.mysqldbAls.sqlTransaction(async () => {
      const buy_DB = await this.buySql.getBuy(buy.buyid);
      //验证操作区域权限，没有该供应商的操作区域不能修改，更新的操作区域没有权限也不能更新
      if (state.user.buy_operateareaids.indexOf(buy_DB.operateareaid) === -1) {
        await Promise.reject(new Error("缺少该操作区域权限,更新失败"));
      }
      //如果没有审核和财审可以修改供应商资料
      if (buy_DB.level1review + buy_DB.level2review === 0) {
        await this.buySql.delete_data(buy);
      } else {
        await Promise.reject(new Error("供应商已审核无法删除，请先撤审"));
      }
    });
  }

  public async undelete(buy: DeleteBuyDto, state: State) {
    buy.del_uuid = 0;
    buy.deletedAt = null;
    buy.deleter = null;
    return await this.mysqldbAls.sqlTransaction(async () => {
      const buy_DB = await this.buySql.getDeletedBuy(buy.buyid);
      //验证操作区域权限，没有该供应商的操作区域不能修改，更新的操作区域没有权限也不能更新
      if (state.user.buy_operateareaids.indexOf(buy_DB.operateareaid) === -1) {
        await Promise.reject(new Error("缺少该操作区域权限,更新失败"));
      }
      await this.buySql.undelete(buy);
    });
  }

  public async level1Review(buy: L1reviewBuyDto, state: State) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      const buy_DB = await this.buySql.getBuy(buy.buyid);
      let res;
      switch (buy.level1review) {
        case 0:
          if (buy_DB.level1review === 1 && buy_DB.level2review === 0) {
            buy_DB.level1review = 0;
            buy_DB.level1name = null;
            buy_DB.level1date = null;
            await this.buySql.update(buy_DB);
            res = "撤审成功";
          } else {
            await Promise.reject(new Error("供应商未审核，无法撤审"));
          }
          break;
        case 1:
          if (buy_DB.level1review === 0 && buy_DB.level2review === 0) {
            buy_DB.level1review = 1;
            buy_DB.level1name = state.user.username;
            buy_DB.level1date = new Date();
            await this.buySql.update(buy_DB);
            res = "审核成功";
          } else {
            await Promise.reject(new Error("供应商已审核，无需重复"));
          }
          break;
        default:
          break;
      }
      return res;
    });

  }

  public async level2Review(buy: L2reviewDto, state: State) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      const buy_DB = await this.buySql.getBuy(buy.buyid);
      let res;
      switch (buy.level2review) {
        case 0:
          if (buy_DB.level1review === 1 && buy_DB.level2review === 1) {
            buy_DB.level2review = 0;
            buy_DB.level2name = "";
            buy_DB.level2date = null;
            await this.buySql.update(buy_DB);
            res = "撤审成功";
          } else {
            await Promise.reject(new Error("财务审核未审核，无法撤审"));
          }
          break;
        case 1:
          if (buy_DB.level1review === 1 && buy_DB.level2review === 0) {
            buy_DB.level2review = 1;
            buy_DB.level2name = state.user.username;
            buy_DB.level2date = new Date();
            await this.buySql.update(buy_DB);
            res = "审核成功";
          } else {
            await Promise.reject(new Error("财务审核已审核，无需重复"));
          }
          break;
        default:
          break;
      }
      return res;
    });

  }

}
