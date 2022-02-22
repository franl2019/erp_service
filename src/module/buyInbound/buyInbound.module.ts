import {Module} from "@nestjs/common";
import {InboundModule} from "../inbound/inbound.module";
import {BuyInboundController} from "./buyInbound.controller";
import {BuyInboundService} from "./buyInbound.service";

@Module({
    imports:[InboundModule],
    controllers:[BuyInboundController],
    providers:[BuyInboundService],
})
export class BuyInboundModule {
}