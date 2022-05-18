import { Injectable } from "@nestjs/common";
import { WarehouseSql } from "./warehouse.sql";
import { AddWarehouseDto } from "./dto/addWarehouse.dto";
import { UpdateWarehouseDto } from "./dto/updateWarehouse.dto";
import { DeleteWarehouseDto } from "./dto/deleteWarehouse.dto";
import { State } from "../../interface/IState";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { SelectWarehouse_authDto } from "./dto/selectWarehouse_auth.dto";

@Injectable()
export class WarehouseService {

  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly warehouseSql: WarehouseSql) {
  }

  public async findOne(warehouseId:number){
    return await this.warehouseSql.findOne(warehouseId);
  }

  public async select() {
    return await this.warehouseSql.getWarehouses();
  }

  public async select_auth(selectAuthDto:SelectWarehouse_authDto) {
    return await this.warehouseSql.getWarehouses_auth(selectAuthDto);
  }

  public async getWarehouseAuthDefault(selectAuthDto:SelectWarehouse_authDto){
    return await this.warehouseSql.getWarehouse_auth_default(selectAuthDto)
  }

  public async unselect() {
    return await this.warehouseSql.getDeletedWarehouses();
  }

  public async add(addDto: AddWarehouseDto) {
    return await this.warehouseSql.add(addDto);
  }

  public async update(updateDto: UpdateWarehouseDto) {
    return await this.warehouseSql.update(updateDto);
  }

  public async delete_data(deleteDto: DeleteWarehouseDto, state: State) {
    deleteDto.del_uuid = deleteDto.warehouseid;
    deleteDto.deletedAt = new Date();
    deleteDto.deleter = state.user.username;

    return this.mysqldbAls.sqlTransaction(async () => {
      const products = await this.warehouseSql.getProductBelongToWarehouse(deleteDto.warehouseid);
      if (products.length !== 0) {
        return Promise.reject(new Error("仓库下已有产品资料，不能删除仓库"));
      }

      return await this.warehouseSql.delete_data(deleteDto);
    });

  }

  public async undelete(deleteDto: DeleteWarehouseDto) {
    deleteDto.del_uuid = 0;
    deleteDto.deletedAt = null;
    deleteDto.deleter = null;
    await this.warehouseSql.undelete(deleteDto);
  }
}
