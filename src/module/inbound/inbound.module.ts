import {Module} from "@nestjs/common";
import {InboundService} from "./inbound.service";
import {InboundEntity} from "./inbound.entity";
import {InboundMxModule} from "../inboundMx/inboundMx.module";
import {InventoryModule} from "../inventory/inventory.module";
import {AutoCodeMxModule} from "../autoCodeMx/autoCodeMx.module";
import {AccountsPayableModule} from "../accountsPayable/accountsPayable.module";
import {AccountsPayableMxModule} from "../accountsPayableMx/accountsPayableMx.module";
import {ClientModule} from "../client/client.module";
import {WeightedAverageRecordModule} from "../weightedAverageRecord/weightedAverageRecord.module";

@Module({
    imports: [
        InboundMxModule,
        InventoryModule,
        AutoCodeMxModule,
        AccountsPayableModule,
        AccountsPayableMxModule,
        ClientModule,
        WeightedAverageRecordModule
    ],
    providers: [InboundService, InboundEntity],
    exports: [InboundService]
})
export class InboundModule {
}