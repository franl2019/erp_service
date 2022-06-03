import { Module } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { MysqldbModule } from "../mysqldb/mysqldb.module";
import { InventoryEntity } from "./inventory.entity";
import { ClientModule } from "../client/client.module";
import {ProductAreaModule} from "../productArea/productArea.module";


@Module({
  imports:[MysqldbModule,ClientModule,ProductAreaModule],
  controllers:[InventoryController],
  providers:[InventoryEntity,InventoryService],
  exports:[InventoryService]
})
export class InventoryModule {}