import { Module } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { MysqldbModule } from "../mysqldb/mysqldb.module";
import { InventoryEntity } from "./inventory.entity";
import { ClientModule } from "../client/client.module";


@Module({
  imports:[MysqldbModule,ClientModule],
  controllers:[InventoryController],
  providers:[InventoryEntity,InventoryService],
  exports:[InventoryService]
})
export class InventoryModule {}