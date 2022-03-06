import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountsReceivableMxController} from "./accountsReceivableMx.controller";
import {AccountsReceivableMxService} from "./accountsReceivableMx.service";
import {AccountsReceivableMxEntity} from "./accountsReceivableMx.entity";

@Module({
    imports: [MysqldbModule],
    controllers: [AccountsReceivableMxController],
    providers: [AccountsReceivableMxService, AccountsReceivableMxEntity],
    exports: [AccountsReceivableMxService]
})
export class AccountsReceivableMxModule {
}