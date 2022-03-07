import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountInComeController} from "./accountInCome.controller";
import {AccountInComeEntity} from "./accountInCome.entity";
import {AccountInComeService} from "./accountInCome.service";
import {AutoCodeMxModule} from "../autoCodeMx/autoCodeMx.module";
import {AccountRecordModule} from "../accountsRecord/accountRecord.module";
import {AccountInComeAmountMxModule} from "../accountInComeAmountMx/accountInComeAmountMx.module";
import {AccountsReceivableModule} from "../accountsReceivable/accountsReceivable.module";
import {AccountsReceivableMxModule} from "../accountsReceivableMx/accountsReceivableMx.module";

@Module({
    imports: [
        MysqldbModule,
        AutoCodeMxModule,
        AccountRecordModule,
        AccountsReceivableModule,
        AccountsReceivableMxModule,
        AccountInComeAmountMxModule,

    ],
    controllers: [AccountInComeController],
    providers: [AccountInComeEntity, AccountInComeService],
    exports: [AccountInComeService]
})
export class AccountInComeModule {

}