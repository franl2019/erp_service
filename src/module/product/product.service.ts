import { Injectable } from "@nestjs/common";
import { ProductSql } from "./product.sql";
import { SelectProductDto } from "./dto/selectProduct.dto";
import { UpdateProductDto } from "./dto/updateProduct.dto";
import { DeleteProductDto } from "./dto/deleteProduct.dto";
import { L1ReviewProductDto } from "./dto/l1ReviewProduct.dto";
import { L2ReviewProductDto } from "./dto/l2ReviewProduct.dto";
import { State } from "../../interface/IState";
import { AddProductDto } from "./dto/addProduct.dto";
import { ProductAreaSql } from "../productArea/productArea.sql";
import { MysqldbAls } from "../mysqldb/mysqldbAls";


@Injectable()
export class ProductService {

  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly productAreaSql: ProductAreaSql,
    private readonly productSql: ProductSql) {
  }

  public async findOne(productId:number){
    return await this.productSql.findOne(productId);
  }

  public async select(product: SelectProductDto, state: State) {
    product.warehouseids = state.user.warehouseids;
    return await this.productSql.getProducts(product);
  }

  public async unselect(product: SelectProductDto, state: State) {
    product.warehouseids = state.user.warehouseids;
    return await this.productSql.getDeletedProducts(product);
  }

  public async add(product: AddProductDto, state: State) {
    product.creater = state.user.username;
    product.createdAt = new Date();
    if (state.user.warehouseids.indexOf(product.warehouseid) === -1) {
      await Promise.reject(new Error("缺少该仓库权限,保存失败"));
    }
    await this.productAreaSql.getProductArea(product.productareaid);
    await this.productSql.add(product);
  }

  public async update(product: UpdateProductDto, state: State) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      product.updater = state.user.username;
      product.updatedAt = new Date();
      const product_DB = await this.productSql.findOne(product.productid);
      //验证操作区域权限，没有该客户的操作区域不能修改，更新的操作区域没有权限也不能更新
      if (state.user.warehouseids.indexOf(product_DB.warehouseid) === -1 || state.user.warehouseids.indexOf(product.warehouseid) === -1) {
        await Promise.reject(new Error("缺少该仓库权限,更新失败"));
      }
      if (product_DB.level1review + product_DB.level2review === 0) {
        await this.productSql.update(product);
      } else {
        await Promise.reject(new Error("产品资料已审核无法更新保存，请先撤审"));
      }
    });
  }

  public async delete_data(product: DeleteProductDto, state: State) {
    product.del_uuid = product.productid;
    product.deletedAt = new Date();
    product.deleter = state.user.username;
    return await this.mysqldbAls.sqlTransaction(async () => {
      const product_DB = await this.productSql.findOne(product.productid);
      //验证操作区域权限，没有该客户的操作区域不能修改，更新的操作区域没有权限也不能更新
      if (state.user.warehouseids.indexOf(product_DB.warehouseid) === -1) {
        await Promise.reject(new Error("缺少该仓库权限,更新失败"));
      }
      if (product_DB.level1review + product_DB.level2review === 0) {
        await this.productSql.delete_data(product);
      } else {
        await Promise.reject(new Error("产品资料已审核无法删除，请先撤审"));
      }
    });
  }

  public async undelete(product: DeleteProductDto, state: State) {
    product.del_uuid = 0;
    product.deletedAt = null;
    product.deleter = null;
    return await this.mysqldbAls.sqlTransaction(async () => {
      const product_DB = await this.productSql.getDeletedProduct(product.productid);
      //验证操作区域权限，没有该客户的操作区域不能修改，更新的操作区域没有权限也不能更新
      if (state.user.warehouseids.indexOf(product_DB.warehouseid) === -1) {
        await Promise.reject(new Error("缺少该仓库权限,更新失败"));
      }

      if (product_DB.del_uuid !== 0) {
        await this.productSql.undelete(product);
      } else {
        await Promise.reject(new Error("产品资料未删除，不能取消删除"));
      }
    });
  }

  public async level1Review(product: L1ReviewProductDto, state: State) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      const product_DB = await this.productSql.findOne(product.productid);
      let res;
      switch (product.level1review) {
        case 0:
          if (product_DB.level1review === 1 && product_DB.level2review === 0) {
            product_DB.level1review = 0;
            product_DB.level1name = null;
            product_DB.level1date = null;
            await this.productSql.update(product_DB);
            res = "撤审成功";
          } else if (product_DB.level1review === 0 && product_DB.level2review === 0) {
            await Promise.reject(new Error("产品资料未审核，无法撤审"));
          } else {
            await Promise.reject(new Error("产品资料已财审，无法撤审"));
          }
          break;
        case 1:
          if (product_DB.level1review === 0 && product_DB.level2review === 0) {
            product_DB.level1review = 1;
            product_DB.level1name = state.user.username;
            product_DB.level1date = new Date();
            await this.productSql.update(product_DB);
            res = "审核成功";
          } else if (product_DB.level1review === 1 && product_DB.level2review === 0) {
            await Promise.reject(new Error("产品资料已审核，无需重复"));
          } else {
            await Promise.reject(new Error("产品资料审核状态异常"));
          }
          break;
        default:
          break;
      }
      return res;
    });
  }

  public async level2Review(product: L2ReviewProductDto, state: State) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      const product_DB = await this.productSql.findOne(product.productid);
      let res;
      switch (product.level2review) {
        case 0:
          if (product_DB.level1review === 1 && product_DB.level2review === 1) {
            product_DB.level2review = 0;
            product_DB.level2name = null;
            product_DB.level2date = null;
            await this.productSql.update(product_DB);
            res = "撤审成功";
          } else {
            await Promise.reject(new Error("财务审核未审核，无法撤审"));
          }
          break;
        case 1:
          if (product_DB.level1review === 1 && product_DB.level2review === 0) {
            product_DB.level2review = 1;
            product_DB.level2name = state.user.username;
            product_DB.level2date = new Date();
            await this.productSql.update(product_DB);
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