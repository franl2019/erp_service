import { Module } from "@nestjs/common";
import { Inbound_mxController } from "./inbound_mx.controller";
import { Inbound_mxService } from "./inbound_mx.service";
import { InboundMxEntity } from "./inbound_mx.entity";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  controllers:[Inbound_mxController],
  providers:[Inbound_mxService,InboundMxEntity],
  exports:[Inbound_mxService]
})
export class InboundMxModule {}