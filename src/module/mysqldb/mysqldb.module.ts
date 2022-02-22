import { Module } from "@nestjs/common";
import { Mysqldb } from "./mysqldb";
import { MysqldbAls } from "./mysqldbAls";

@Module({
  providers:[Mysqldb,MysqldbAls],
  exports:[MysqldbAls]
})
export class MysqldbModule {}