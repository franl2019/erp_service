import {Module} from "@nestjs/common";
import {OutboundModule} from "../outbound/outbound.module";
import {SaleOutboundService} from "./saleOutbound.service";
import {SaleOutboundController} from "./saleOutbound.controller";
import { AccountsReceivableModule } from "../accountsReceivable/accountsReceivable.module";
import {MysqldbModule} from "../mysqldb/mysqldb.module";

@Module({
    imports:[OutboundModule,AccountsReceivableModule,MysqldbModule],
    controllers:[SaleOutboundController],
    providers:[SaleOutboundService]
})
export class SaleOutboundModule {
}