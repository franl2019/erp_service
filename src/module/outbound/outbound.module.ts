import {Module} from "@nestjs/common";
import {OutboundService} from "./outbound.service";
import {OutboundEntity} from "./outbound.entity";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {OutboundMxModule} from "../outboundMx/outboundMx.module";
import {InventoryModule} from "../inventory/inventory.module";
import {AutoCodeMxModule} from "../autoCodeMx/autoCodeMx.module";
import {AccountsReceivableMxModule} from "../accountsReceivableMx/accountsReceivableMx.module";
import {AccountsReceivableModule} from "../accountsReceivable/accountsReceivable.module";

@Module({
    imports: [MysqldbModule, OutboundMxModule, AutoCodeMxModule, InventoryModule, AccountsReceivableMxModule, AccountsReceivableModule],
    providers: [OutboundService, OutboundEntity],
    exports: [OutboundService]
})
export class OutboundModule {
}