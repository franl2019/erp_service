import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountsReceivableService} from "./accountsReceivable.service";
import {AccountsReceivableEntity} from "./accountsReceivable.entity";
import {AccountsReceivableController} from "./accountsReceivable.controller";

@Module({
    imports: [MysqldbModule],
    providers: [AccountsReceivableService, AccountsReceivableEntity],
    controllers: [AccountsReceivableController],
    exports: [AccountsReceivableService]
})
export class AccountsReceivableModule {}