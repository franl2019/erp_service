import {Module} from "@nestjs/common";
import {InboundService} from "./inbound.service";
import {InboundEntity} from "./inbound.entity";
import {Inbound_mxModule} from "../inbound_mx/inbound_mx.module";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {InventoryModule} from "../inventory/inventory.module";
import {AutoCodeMxModule} from "../autoCodeMx/autoCodeMx.module";
import {AccountsPayableModule} from "../accountsPayable/accountsPayable.module";
import {AccountsPayableMxModule} from "../accountsPayableMx/accountsPayableMx.module";

@Module({
    imports: [MysqldbModule, Inbound_mxModule, InventoryModule, AutoCodeMxModule, AccountsPayableModule, AccountsPayableMxModule],
    providers: [InboundService, InboundEntity],
    exports: [InboundService]
})
export class InboundModule {
}