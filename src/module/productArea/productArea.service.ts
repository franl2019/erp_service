import { Injectable } from "@nestjs/common";
import { ProductAreaSql } from "./productArea.sql";
import { UpdateProductAreaDto } from "./dto/updateProductArea.dto";
import { AddProductAreaDto } from "./dto/addProductArea.dto";
import { DeleteProductAreaDto } from "./dto/deleteProductArea.dto";
import { State } from "../../interface/IState";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import {IProductArea} from "./productArea";

@Injectable()
export class ProductAreaService {

  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly productAreaSql: ProductAreaSql) {
  }

  //获取父级地区List
  public async getParentProductArea(productArea: IProductArea) {
    const productAreas = await this.find()
    const parentAreaList: IProductArea[] = []

    getChild(productArea);

    function getChild(productArea: IProductArea) {
      for (let i = 0; i < productAreas.length; i++) {
        const productAreaItem = productAreas[i];
        if (productArea.parentid === productAreaItem.productareaid) {
          parentAreaList.push(productAreaItem);
          getChild(productAreaItem);
        }
      }
    }


    parentAreaList.reverse();

    return parentAreaList
  }

  //获取子地区List
  public async getChildProductArea(productArea: IProductArea) {
    const productAreas = await this.find()
    const childAreaList: IProductArea[] = []

    getChild(productArea);

    function getChild(productArea: IProductArea) {
      for (let i = 0; i < productAreas.length; i++) {
        const productAreaItem = productAreas[i];
        if (productArea.productareaid === productAreaItem.parentid) {
          childAreaList.push(productAreaItem);
          getChild(productAreaItem);
        }
      }
    }


    childAreaList.reverse();

    return childAreaList
  }

  public async getParenCode(productArea: IProductArea){
    const parentProductAreaList = await this.getParentProductArea(productArea)

    let parenCode = '';
    for (let i = 0; i < parentProductAreaList.length; i++) {
      parenCode = parenCode + parentProductAreaList[i].productareacode
    }

    return parenCode + productArea.productareacode;
  }

  public async getChildIdList(productArea: IProductArea){
    const childIdList:number[] = [];
    const childList = await this.getChildProductArea(productArea);
    childList.push(productArea);

    for (let i = 0; i < childList.length; i++) {
      childIdList.push(childList[i].productareaid);
    }

    return childIdList
  }

  public async find() {
    return await this.productAreaSql.find();
  }

  public async findOne(productareaid: number) {
    return await this.productAreaSql.findOne(productareaid);
  }

  public async unselect() {
    return await this.productAreaSql.getDeleteProductAreas();
  }

  public async create(productArea: AddProductAreaDto) {

    productArea.parentCode = await this.getParenCode(productArea);

    return await this.mysqldbAls.sqlTransaction(async () => {
      // ProductArea.parentid = 0 根类别
      if (productArea.parentid !== 0) {
        //检查所属类别是否存在
        const parentProductArea = await this.productAreaSql.findOne(productArea.parentid);
        //更新父级类别sonflag标记
        await this.productAreaSql.updateSonflag(parentProductArea.productareaid);
        //添加类别
        return await this.productAreaSql.create(productArea);
      } else {
        //添加类别
        return await this.productAreaSql.create(productArea);
      }
    });
  }

  public async update(productArea: UpdateProductAreaDto) {

    if (productArea.productareaid === productArea.parentid) {
      return Promise.reject(new Error("所属类别不能选择类别自身，保存失败"));
    }

    productArea.parentCode = await this.getParenCode(productArea);

    return await this.mysqldbAls.sqlTransaction(async () => {
      const productArea_DB = await this.productAreaSql.findOne(productArea.productareaid);
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

      const productArea_DB = await this.productAreaSql.findOne(productArea.productareaid);
      const childrenProductAreas = await this.productAreaSql.getChildrenProductArea(productArea.productareaid);
      if (childrenProductAreas.length !== 0) {
        return Promise.reject(new Error("产品类别下级存在,不能删除"));
      }
      await this.productAreaSql.delete_data(productArea.productareaid,state.user.username);
      if (productArea_DB.parentid !== 0) {
        await this.productAreaSql.updateSonflag(productArea_DB.parentid);
      }
    });
  }
}
