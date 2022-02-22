import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountsPayableMxController} from "./accountsPayableMx.controller";
import {AccountsPayableMxService} from "./accountsPayableMx.service";
import {AccountsPayableMxEntity} from "./accountsPayableMx.entity";

@Module({
    imports: [MysqldbModule],
    controllers: [AccountsPayableMxController],
    providers: [AccountsPayableMxService, AccountsPayableMxEntity],
    exports: [AccountsPayableMxService]
})
export class AccountsPayableMxModule {

}