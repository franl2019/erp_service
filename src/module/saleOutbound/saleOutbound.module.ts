import {Module} from "@nestjs/common";
import {OutboundModule} from "../outbound/outbound.module";
import {SaleOutboundService} from "./saleOutbound.service";
import {SaleOutboundController} from "./saleOutbound.controller";

@Module({
    imports:[OutboundModule],
    controllers:[SaleOutboundController],
    providers:[SaleOutboundService]
})
export class SaleOutboundModule {
}