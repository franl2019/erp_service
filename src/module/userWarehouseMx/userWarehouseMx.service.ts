import { Injectable } from "@nestjs/common";
import { AddUserWarehouseMxDto } from "./dto/addUserWarehouseMx.dto";
import { UserWarehouseMxSql } from "./userWarehouseMx.sql";
import { SelectUserWarehouseMxDto } from "./dto/selectUserWarehouseMx.dto";
import { DeleteUserWarehouseMxDto } from "./dto/deleteUserWarehouseMx.dto";
import { MysqldbAls } from "../mysqldb/mysqldbAls";


@Injectable()
export class UserWarehouseMxService {
  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly userWarehouseMxSql: UserWarehouseMxSql) {
  }

  public async select(selectDto: SelectUserWarehouseMxDto) {

      return await this.userWarehouseMxSql.getUserWarehouseMxs(selectDto);

  }

  public async findAll(selectDto: SelectUserWarehouseMxDto){
    return await this.userWarehouseMxSql.getUserWarehouseMxInfo(selectDto);
  }

  public async add(addDto: AddUserWarehouseMxDto) {

      return await this.userWarehouseMxSql.add(addDto);

  }

  public async delete_data(deleteDto: DeleteUserWarehouseMxDto) {

      return await this.userWarehouseMxSql.delete_data(deleteDto);

  }
}