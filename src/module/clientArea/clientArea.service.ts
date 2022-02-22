import { Injectable } from "@nestjs/common";
import { ClientAreaSql } from "./clientArea.sql";
import { UpdateClientAreaDto } from "./dto/updateClientArea.dto";
import { AddClientAreaDto } from "./dto/addClientArea.dto";
import { DeleteClientAreaDto } from "./dto/deleteClientArea.dto";
import { State } from "../../interface/IState";
import { MysqldbAls } from "../mysqldb/mysqldbAls";

@Injectable()
export class ClientAreaService {

  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly clientAreaSql: ClientAreaSql) {
  }

  public async select() {
    return await this.clientAreaSql.getClientAreas();
  }

  public async findOne(clientareaid: number) {
    return await this.clientAreaSql.getClientArea(clientareaid);
  }

  public async unselect() {
    return await this.clientAreaSql.getDeleteClientAreas();
  }

  public async add(clientArea: AddClientAreaDto) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      let res;
      // ClientArea.parentid = 0 根地区
      if (clientArea.parentid !== 0) {
        //检查所属地区是否存在
        const parentClientArea = await this.clientAreaSql.getClientArea(clientArea.parentid);
        //添加地区
        res = await this.clientAreaSql.add(clientArea);
        //更新父级地区sonflag标记
        await this.clientAreaSql.updateSonflag(parentClientArea.clientareaid);
      } else {
        //添加地区
        res = await this.clientAreaSql.add(clientArea);
      }
      return res;
    });


  }

  public async update(clientArea: UpdateClientAreaDto) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      const clientArea_DB = await this.clientAreaSql.getClientArea(clientArea.clientareaid);

      if (clientArea.clientareaid === clientArea.parentid) {
        return Promise.reject(new Error("不能选择自己作为父级区域"));
      }

      //检查是否存在下级区域，有下级区域不能修改parentid
      if (clientArea.parentid !== clientArea_DB.parentid) {
        const childrenClientAreas = await this.clientAreaSql.getChildrenClientArea(clientArea.clientareaid);
        if (childrenClientAreas.length > 0) {
          return Promise.reject(new Error("客户地区下级存在,不能修改类别所属"));
        } else {
          await this.clientAreaSql.update(clientArea);
        }
      } else {
        await this.clientAreaSql.update(clientArea);
      }

      if (clientArea.parentid !== clientArea_DB.parentid && clientArea_DB.parentid !== 0) {
        await this.clientAreaSql.updateSonflag(clientArea_DB.parentid);
      }

      if (clientArea.parentid !== clientArea_DB.parentid && clientArea.parentid !== 0) {
        await this.clientAreaSql.updateSonflag(clientArea.parentid);
      }
    });
  }

  public async delete_data(clientArea: DeleteClientAreaDto, state: State) {
    clientArea.del_uuid = clientArea.clientareaid;
    clientArea.deletedAt = new Date();
    clientArea.deleter = state.user.username;
    return await this.mysqldbAls.sqlTransaction(async () => {

      //查询客户地区下的客户
      const clientFromClientAreaList = await this.clientAreaSql.getClientBelongsToClientArea(clientArea.clientareaid);
      if (clientFromClientAreaList.length !== 0) {
        return Promise.reject(new Error("客户地区下存在客户，不能删除"));
      }

      const clientArea_DB = await this.clientAreaSql.getClientArea(clientArea.clientareaid);
      const childrenClientAreas = await this.clientAreaSql.getChildrenClientArea(clientArea.clientareaid);
      if (childrenClientAreas.length !== 0) {
        return Promise.reject(new Error("客户地区下级存在,不能删除"));
      }
      await this.clientAreaSql.delete_data(clientArea);
      if (clientArea_DB.parentid !== 0) {
        await this.clientAreaSql.updateSonflag(clientArea_DB.parentid);
      }
    });
  }

  public async undelete(clientArea: DeleteClientAreaDto) {
    clientArea.del_uuid = 0;
    clientArea.deletedAt = null;
    clientArea.deleter = null;
    return await this.mysqldbAls.sqlTransaction(async () => {
      const clientArea_DB = await this.clientAreaSql.getDeleteClientArea(clientArea.clientareaid);
      await this.clientAreaSql.undelete(clientArea);
      if (clientArea_DB.parentid !== 0) {
        await this.clientAreaSql.updateSonflag(clientArea_DB.parentid);
      }
    });
  }

}
