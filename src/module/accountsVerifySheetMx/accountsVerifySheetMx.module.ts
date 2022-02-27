import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountsVerifySheetMxController} from "./accountsVerifySheetMx.controller";
import {AccountsVerifySheetMxService} from "./accountsVerifySheetMx.service";
import {AccountsVerifySheetMxEntity} from "./accountsVerifySheetMx.entity";

@Module({
    imports: [MysqldbModule],
    controllers: [AccountsVerifySheetMxController],
    providers: [AccountsVerifySheetMxService, AccountsVerifySheetMxEntity],
    exports: [AccountsVerifySheetMxService]
})
export class AccountsVerifySheetMxModule {

}