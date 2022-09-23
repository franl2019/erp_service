import { Module } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { InventoryEntity } from "./inventory.entity";
import { ClientModule } from "../client/client.module";
import {ProductAreaModule} from "../productArea/productArea.module";


@Module({
  imports:[
    ClientModule,
    ProductAreaModule
  ],
  controllers:[InventoryController],
  providers:[InventoryEntity,InventoryService],
  exports:[InventoryService]
})
export class InventoryModule {}