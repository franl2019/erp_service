import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountsPayableService} from "./accountsPayable.service";
import {AccountsPayableEntity} from "./accountsPayable.entity";
import {AccountsPayableController} from "./accountsPayable.controller";

@Module({
    imports: [MysqldbModule],
    providers: [AccountsPayableService, AccountsPayableEntity],
    controllers: [AccountsPayableController],
    exports: [AccountsPayableService]
})
export class AccountsPayableModule {
}