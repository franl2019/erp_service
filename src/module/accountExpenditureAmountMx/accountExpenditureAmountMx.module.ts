import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountExpenditureAmountMxEntity} from "./accountExpenditureAmountMx.entity";
import {AccountExpenditureAmountMxService} from "./accountExpenditureAmountMx.service";

@Module({
    imports: [MysqldbModule],
    providers: [AccountExpenditureAmountMxEntity, AccountExpenditureAmountMxService],
    exports: [AccountExpenditureAmountMxService]
})
export class AccountExpenditureAmountMxModule {

}