import { Injectable } from "@nestjs/common";
import { ClientSql } from "./client.sql";
import { SelectClientDto } from "./dto/selectClient.dto";
import { AddClientDto } from "./dto/addClient.dto";
import { UpdateClientDto } from "./dto/updateClient.dto";
import { DeleteClientDto } from "./dto/deleteClient.dto";
import { L1reviewClientDto } from "./dto/l1reviewClient.dto";
import { L2reviewClientDto } from "./dto/l2reviewClient.dto";
import { State } from "../../interface/IState";
import { ClientAreaSql } from "../clientArea/clientArea.sql";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { Client } from "./client";


@Injectable()
export class ClientService {

  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly clientSql: ClientSql,
    private readonly clientAreaSql: ClientAreaSql) {
  }

  public async findOne(clientid: number){
    return await this.clientSql.findOne(clientid);
  }

  public async select(client: SelectClientDto, state: State) {
    client.operateareaids = state.user.client_operateareaids;
    return await this.clientSql.getClients(client);
  }

  public async selectGsClient(): Promise<Client> {
    return await this.clientSql.getGsClient();
  }

  public async unselect(client: SelectClientDto, state: State) {
    client.operateareaids = state.user.client_operateareaids;
    return await this.clientSql.getDeletedClients(client);
  }

  public async add(client: AddClientDto, state: State) {
    client.creater = state.user.username;
    client.createdAt = new Date();
    if (state.user.client_operateareaids.indexOf(client.operateareaid) === -1) {
      await Promise.reject(new Error("缺少该操作区域权限,保存失败"));
    }


    await this.clientAreaSql.getClientArea(client.clientareaid);
    return await this.clientSql.add(client);

  }

  public async update(client: UpdateClientDto, state: State) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      client.updater = state.user.username;
      client.updatedAt = new Date();
      const client_DB = await this.clientSql.findOne(client.clientid);
      //验证操作区域权限，没有该客户的操作区域不能修改，更新的操作区域没有权限也不能更新
      if (state.user.client_operateareaids.indexOf(client_DB.operateareaid) === -1 || state.user.client_operateareaids.indexOf(client.operateareaid) === -1) {
        await Promise.reject(new Error("缺少该操作区域权限,更新失败"));
      }
      if (client_DB.level1review + client_DB.level2review === 0) {
        await this.clientSql.update(client);
      } else {
        await Promise.reject(new Error("客户已审核无法更新保存，请先撤审"));
      }
    });
  }

  public async delete_data(client: DeleteClientDto, state: State) {
    client.del_uuid = client.clientid;
    client.deletedAt = new Date();
    client.deleter = state.user.username;
    return await this.mysqldbAls.sqlTransaction(async () => {
      const client_DB = await this.clientSql.findOne(client.clientid);
      //验证操作区域权限，没有该客户的操作区域不能修改，更新的操作区域没有权限也不能更新
      if (state.user.client_operateareaids.indexOf(client_DB.operateareaid) === -1) {
        await Promise.reject(new Error("缺少该操作区域权限,更新失败"));
      }
      if (client_DB.level1review + client_DB.level2review === 0) {
        await this.clientSql.delete_data(client);
      } else {
        await Promise.reject(new Error("客户已审核无法删除，请先撤审"));
      }
    });
  }

  public async undelete(client: DeleteClientDto, state: State) {
    client.del_uuid = 0;
    client.deletedAt = null;
    client.deleter = null;
    return await this.mysqldbAls.sqlTransaction(async () => {
      const client_DB = await this.clientSql.getDeletedClient(client.clientid);
      //验证操作区域权限，没有该客户的操作区域不能修改，更新的操作区域没有权限也不能更新
      if (state.user.client_operateareaids.indexOf(client_DB.operateareaid) === -1) {
        await Promise.reject(new Error("缺少该操作区域权限,更新失败"));
      }

      if (client_DB.del_uuid !== 0) {
        await this.clientSql.undelete(client);
      } else {
        await Promise.reject(new Error("客户未删除"));
      }
    });
  }

  public async level1Review(client: L1reviewClientDto, state: State) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      const client_DB = await this.clientSql.findOne(client.clientid);
      let res;
      switch (client.level1review) {
        case 0:
          if (client_DB.level1review === 1 && client_DB.level2review === 0) {
            client_DB.level1review = 0;
            client_DB.level1name = null;
            client_DB.level1date = null;
            await this.clientSql.update(client_DB);
            res = "撤审成功";
          } else if (client_DB.level1review === 0 && client_DB.level2review === 0) {
            await Promise.reject(new Error("客户未审核，无法撤审"));
          } else {
            await Promise.reject(new Error("客户已财审，无法撤审"));
          }
          break;
        case 1:
          if (client_DB.level1review === 0 && client_DB.level2review === 0) {
            client_DB.level1review = 1;
            client_DB.level1name = state.user.username;
            client_DB.level1date = new Date();
            await this.clientSql.update(client_DB);
            res = "审核成功";
          } else if (client_DB.level1review === 1 && client_DB.level2review === 0) {
            await Promise.reject(new Error("客户已审核，无需重复"));
          } else {
            await Promise.reject(new Error("客户审核状态异常"));
          }
          break;
        default:
          break;
      }
      return res;
    });

  }

  public async level2Review(client: L2reviewClientDto, state: State) {
    return await this.mysqldbAls.sqlTransaction(async () => {
      const client_DB = await this.clientSql.findOne(client.clientid);
      let res;
      switch (client.level2review) {
        case 0:
          if (client_DB.level1review === 1 && client_DB.level2review === 1) {
            client_DB.level2review = 0;
            client_DB.level2name = null;
            client_DB.level2date = null;
            await this.clientSql.update(client_DB);
            res = "撤审成功";
          } else {
            await Promise.reject(new Error("财务审核未审核，无法撤审"));
          }
          break;
        case 1:
          if (client_DB.level1review === 1 && client_DB.level2review === 0) {
            client_DB.level2review = 1;
            client_DB.level2name = state.user.username;
            client_DB.level2date = new Date();
            await this.clientSql.update(client_DB);
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
