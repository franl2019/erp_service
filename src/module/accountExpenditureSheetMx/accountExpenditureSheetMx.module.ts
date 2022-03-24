import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountExpenditureSheetMxEntity} from "./accountExpenditureSheetMx.entity";
import {AccountExpenditureSheetMxService} from "./accountExpenditureSheetMx.service";

@Module({
    imports:[MysqldbModule],
    providers:[AccountExpenditureSheetMxEntity,AccountExpenditureSheetMxService],
    exports:[AccountExpenditureSheetMxService]
})
export class AccountExpenditureSheetMxModule {

}