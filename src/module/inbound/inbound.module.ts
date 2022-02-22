import { Module } from "@nestjs/common";
import { InboundService } from "./inbound.service";
import { InboundEntity } from "./inbound.entity";
import { Inbound_mxModule } from "../inbound_mx/inbound_mx.module";
import { MysqldbModule } from "../mysqldb/mysqldb.module";
import { InventoryModule } from "../inventory/inventory.module";
import {AutoCodeMxModule} from "../autoCodeMx/autoCodeMx.module";

@Module({
  imports: [MysqldbModule,Inbound_mxModule,InventoryModule,AutoCodeMxModule],
  providers: [InboundService, InboundEntity],
  exports: [InboundService]
})
export class InboundModule {
}