import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountExpenditureSheetMxEntity} from "./accountExpenditureSheetMx.entity";
import {AccountExpenditureSheetMxService} from "./accountExpenditureSheetMx.service";
import {AccountExpenditureSheetMxController} from "./accountExpenditureSheetMx.controller";

@Module({
    imports:[MysqldbModule],
    controllers:[AccountExpenditureSheetMxController],
    providers:[AccountExpenditureSheetMxEntity,AccountExpenditureSheetMxService],
    exports:[AccountExpenditureSheetMxService]
})
export class AccountExpenditureSheetMxModule {

}