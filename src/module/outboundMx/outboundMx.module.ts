import { Module } from "@nestjs/common";
import { OutboundMxController } from "./outboundMx.controller";
import { OutboundMxService } from "./outboundMx.service";
import { OutboundMxEntity } from "./outboundMx.entity";
import {WarehouseModule} from "../warehouse/warehouse.module";
import {ProductModule} from "../product/product.module";
import {ClientModule} from "../client/client.module";

@Module({
  imports:[
    WarehouseModule,
    ProductModule,
    ClientModule,
  ],
  controllers: [OutboundMxController],
  providers: [OutboundMxService, OutboundMxEntity],
  exports:[OutboundMxService]
})
export class OutboundMxModule {
}