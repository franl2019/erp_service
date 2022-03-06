import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountInComeSheetMxController} from "./accountInComeSheetMx.controller";
import {AccountInComeSheetMxService} from "./accountInComeSheetMx.service";
import {AccountInComeSheetMxEntity} from "./accountInComeSheetMx.entity";

@Module({
    imports: [MysqldbModule],
    controllers: [AccountInComeSheetMxController],
    providers: [AccountInComeSheetMxService, AccountInComeSheetMxEntity],
    exports: [AccountInComeSheetMxService]
})
export class AccountInComeSheetMxModule {
}