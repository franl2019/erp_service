import { Injectable } from "@nestjs/common";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { UserSql } from "./user.sql";

@Injectable()
export class UserService {
  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly userSql: UserSql
  ) {
  }

  public async findAll(){
    return await this.userSql.findAll();
  }

  public async findById(userid: number) {
      return await this.userSql.findById(userid);
  }

  public async findOne(usercode: string) {
      return await this.userSql.findWithUsercode(usercode);
  }
}
