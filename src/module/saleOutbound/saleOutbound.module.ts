import {Module} from "@nestjs/common";
import {OutboundModule} from "../outbound/outbound.module";
import {SaleOutboundService} from "./saleOutbound.service";
import {SaleOutboundController} from "./saleOutbound.controller";
import { AccountsReceivableModule } from "../accountsReceivable/accountsReceivable.module";

@Module({
    imports:[
        OutboundModule,
        AccountsReceivableModule,
    ],
    controllers:[SaleOutboundController],
    providers:[SaleOutboundService]
})
export class SaleOutboundModule {
}