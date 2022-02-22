import {Module} from "@nestjs/common";
import {InboundModule} from "../inbound/inbound.module";
import {ProductionInboundController} from "./productionInbound.controller";
import {ProductionInboundService} from "./productionInbound.service";

@Module({
    imports: [InboundModule],
    controllers: [ProductionInboundController],
    providers: [ProductionInboundService],
    exports: [ProductionInboundService]
})
export class ProductionInboundModule {
}