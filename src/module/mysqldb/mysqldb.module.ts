import {Global, Module} from "@nestjs/common";
import { Mysqldb } from "./mysqldb";
import { MysqldbAls } from "./mysqldbAls";

@Global()
@Module({
  providers:[Mysqldb,MysqldbAls],
  exports:[MysqldbAls]
})
export class MysqldbModule {}