import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountExpenditureAmountMxEntity} from "./accountExpenditureAmountMx.entity";
import {AccountExpenditureAmountMxService} from "./accountExpenditureAmountMx.service";
import {AccountExpenditureAmountMxController} from "./accountExpenditureAmountMx.controller";

@Module({
    imports: [MysqldbModule],
    controllers: [AccountExpenditureAmountMxController],
    providers: [AccountExpenditureAmountMxEntity, AccountExpenditureAmountMxService],
    exports: [AccountExpenditureAmountMxService]
})
export class AccountExpenditureAmountMxModule {
}