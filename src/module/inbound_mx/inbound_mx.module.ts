import { Module } from "@nestjs/common";
import { Inbound_mxController } from "./inbound_mx.controller";
import { Inbound_mxService } from "./inbound_mx.service";
import { Inbound_mxEntity } from "./inbound_mx.entity";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  controllers:[Inbound_mxController],
  providers:[Inbound_mxService,Inbound_mxEntity],
  exports:[Inbound_mxService]
})
export class Inbound_mxModule {}