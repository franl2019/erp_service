import { Module } from "@nestjs/common";
import { Outbound_mxController } from "./outbound_mx.controller";
import { Outbound_mxService } from "./outbound_mx.service";
import { Outbound_mxEntity } from "./outbound_mx.entity";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  controllers: [Outbound_mxController],
  providers: [Outbound_mxService, Outbound_mxEntity],
  exports:[Outbound_mxService]
})
export class Outbound_mxModule {
}