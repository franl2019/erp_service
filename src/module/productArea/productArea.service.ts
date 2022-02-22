import { Injectable } from "@nestjs/common";
import { ProductAreaSql } from "./productArea.sql";
import { UpdateProductAreaDto } from "./dto/updateProductArea.dto";
import { AddProductAreaDto } from "./dto/addProductArea.dto";
import { DeleteProductAreaDto } from "./dto/deleteProductArea.dto";
import { State } from "../../interface/IState";
import { MysqldbAls } from "../mysqldb/mysqldbAls";

@Injectable()
export class ProductAreaService {

  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly productAreaSql: ProductAreaSql) {
  }

  public async select() {
    return await this.productAreaSql.getProductAreas();
  }

  public async findOne(productareaid: number) {
    return await this.productAreaSql.getProductArea(productareaid);
  }

  public async unselect() {
    return await this.productAreaSql.getDeleteProductAreas();
  }

  public async add(productArea: AddProductAreaDto) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      let res;
      // ProductArea.parentid = 0 根类别
      if (productArea.parentid !== 0) {
        //检查所属类别是否存在
        const parentProductArea = await this.productAreaSql.getProductArea(productArea.parentid);
        //添加类别
        res = await this.productAreaSql.add(productArea);
        //更新父级类别sonflag标记
        await this.productAreaSql.updateSonflag(parentProductArea.productareaid);
      } else {
        //添加类别
        res = await this.productAreaSql.add(productArea);
      }
      return res;
    });
  }

  public async update(productArea: UpdateProductAreaDto) {
    if (productArea.productareaid === productArea.parentid) {
      return Promise.reject(new Error("所属类别不能选择类别自身，保存失败"));
    }
    return await this.mysqldbAls.sqlTransaction(async () => {
      const productArea_DB = await this.productAreaSql.getProductArea(productArea.productareaid);
      //检查是否存在下级区域，有下级区域不能修改parentid
      if (productArea.parentid !== productArea_DB.parentid) {
        const childrenProductAreas = await this.productAreaSql.getChildrenProductArea(productArea.productareaid);
        if (childrenProductAreas.length > 0) {
          return Promise.reject(new Error("产品类别下级存在,不能修改类别所属"));
        } else {
          await this.productAreaSql.update(productArea);
        }
      } else {
        await this.productAreaSql.update(productArea);
      }
      if (productArea.parentid !== productArea_DB.parentid && productArea_DB.parentid !== 0) {
        await this.productAreaSql.updateSonflag(productArea_DB.parentid);
      }
      if (productArea.parentid !== productArea_DB.parentid && productArea.parentid !== 0) {
        await this.productAreaSql.updateSonflag(productArea.parentid);
      }
    });
  }

  public async delete_data(productArea: DeleteProductAreaDto, state: State) {
    productArea.del_uuid = productArea.productareaid;
    productArea.deletedAt = new Date();
    productArea.deleter = state.user.username;
    return await this.mysqldbAls.sqlTransaction(async () => {
      //检查产品类别下的产品资料数量
      const productBelongsToProductAreaList = await this.productAreaSql.getProductBelongsToProductArea(productArea.productareaid);
      if (productBelongsToProductAreaList.length > 0) {
        return Promise.reject(new Error("产品类别下存在产品资料,不能删除"));
      }

      const productArea_DB = await this.productAreaSql.getProductArea(productArea.productareaid);
      const childrenProductAreas = await this.productAreaSql.getChildrenProductArea(productArea.productareaid);
      if (childrenProductAreas.length !== 0) {
        return Promise.reject(new Error("产品类别下级存在,不能删除"));
      }
      await this.productAreaSql.delete_data(productArea);
      if (productArea_DB.parentid !== 0) {
        await this.productAreaSql.updateSonflag(productArea_DB.parentid);
      }
    });
  }

  public async undelete(productArea: DeleteProductAreaDto) {
    productArea.del_uuid = 0;
    productArea.deletedAt = null;
    productArea.deleter = null;
    return await this.mysqldbAls.sqlTransaction(async () => {
      const productArea_DB = await this.productAreaSql.getDeleteProductArea(productArea.productareaid);
      await this.productAreaSql.undelete(productArea);
      if (productArea_DB.parentid !== 0) {
        await this.productAreaSql.updateSonflag(productArea_DB.parentid);
      }
    });
  }
}
