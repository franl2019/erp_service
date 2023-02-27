import {Module} from "@nestjs/common";
import {OutboundService} from "./outbound.service";
import {OutboundEntity} from "./outbound.entity";
import {OutboundMxModule} from "../outboundMx/outboundMx.module";
import {InventoryModule} from "../inventory/inventory.module";
import {AutoCodeMxModule} from "../autoCodeMx/autoCodeMx.module";
import {AccountsReceivableMxModule} from "../accountsReceivableMx/accountsReceivableMx.module";
import {AccountsReceivableModule} from "../accountsReceivable/accountsReceivable.module";
import {WeightedAverageRecordModule} from "../weightedAverageRecord/weightedAverageRecord.module";

@Module({
    imports: [
        OutboundMxModule,
        AutoCodeMxModule,
        InventoryModule,
        AccountsReceivableMxModule,
        AccountsReceivableModule,
        WeightedAverageRecordModule,
    ],
    providers: [OutboundService, OutboundEntity],
    exports: [OutboundService]
})
export class OutboundModule {
}