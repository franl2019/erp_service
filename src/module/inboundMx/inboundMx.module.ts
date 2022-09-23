import { Module } from "@nestjs/common";
import { InboundMxController } from "./inboundMx.controller";
import { InboundMxService } from "./inboundMx.service";
import { InboundMxEntity } from "./inboundMx.entity";
import {ClientModule} from "../client/client.module";
import {ProductModule} from "../product/product.module";

@Module({
  imports:[
    ClientModule,
    ProductModule
  ],
  controllers:[InboundMxController],
  providers:[InboundMxService,InboundMxEntity],
  exports:[InboundMxService]
})
export class InboundMxModule {}