import { Module } from "@nestjs/common";
import { InboundMxController } from "./inboundMx.controller";
import { InboundMxService } from "./inboundMx.service";
import { InboundMxEntity } from "./inboundMx.entity";
import { MysqldbModule } from "../mysqldb/mysqldb.module";
import {ClientModule} from "../client/client.module";
import {ProductModule} from "../product/product.module";

@Module({
  imports:[MysqldbModule,ClientModule,ProductModule],
  controllers:[InboundMxController],
  providers:[InboundMxService,InboundMxEntity],
  exports:[InboundMxService]
})
export class InboundMxModule {}