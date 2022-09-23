import {Module} from "@nestjs/common";
import {InboundModule} from "../inbound/inbound.module";
import {BuyInboundController} from "./buyInbound.controller";
import {BuyInboundService} from "./buyInbound.service";
import {AccountsPayableModule} from "../accountsPayable/accountsPayable.module";

@Module({
    imports:[
        InboundModule,
        AccountsPayableModule
    ],
    controllers:[BuyInboundController],
    providers:[BuyInboundService],
})
export class BuyInboundModule {
}