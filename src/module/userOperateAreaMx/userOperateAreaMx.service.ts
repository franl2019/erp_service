import { Injectable } from "@nestjs/common";
import { SelectUserOperateAreaMxDto } from "./dto/selectUserOperateAreaMx.dto";
import { UserOperateAreaMxSql } from "./userOperateAreaMx.sql";
import { AddUserOperateAreaMxDto } from "./dto/addUserOperateAreaMx.dto";
import { DeleteUserOperateAreaMxDto } from "./dto/deleteUserOperateAreaMx.dto";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import {IState} from "../../decorator/user.decorator";


@Injectable()
export class UserOperateAreaMxService {
  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly userOperateAreaMxSql: UserOperateAreaMxSql
  ) {
  }

  //查询用户的多个操作区域权限
  public async findUserOperaAreaIdList(selectDto: SelectUserOperateAreaMxDto) {
      return await this.userOperateAreaMxSql.getUserOperaAreaIdList(selectDto);
  }

  //查询用户的操作区域权限数组
  public async findUserOperaAreasInfoList(selectDto: SelectUserOperateAreaMxDto){
    return await this.userOperateAreaMxSql.getUserOperaAreasInfoList(selectDto);
  }

  //查询用户默认操作区域
  public async findUserDefaultOperateArea(state:IState){
    return await this.userOperateAreaMxSql.getUserDefaultOperateArea(state);
  }

  //为用户添加操作区域权限
  public async add(addDto: AddUserOperateAreaMxDto) {
      return await this.userOperateAreaMxSql.add(addDto);
  }

  //删除用户操作区域权限
  public async delete_data(deleteDto: DeleteUserOperateAreaMxDto) {
      return await this.userOperateAreaMxSql.delete_data(deleteDto);
  }
}
