import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountsVerifySheetController} from "./accountsVerifySheet.controller";
import {AccountsVerifySheetService} from "./accountsVerifySheet.service";
import {AccountsVerifySheetEntity} from "./accountsVerifySheet.entity";
import {AccountsVerifySheetMxModule} from "../accountsVerifySheetMx/accountsVerifySheetMx.module";
import {AccountsPayableModule} from "../accountsPayable/accountsPayable.module";
import {AccountsReceivableModule} from "../accountsReceivable/accountsReceivable.module";
import {AccountsPayableMxModule} from "../accountsPayableMx/accountsPayableMx.module";
import {AccountsReceivableMxModule} from "../accountsReceivableMx/accountsReceivableMx.module";

@Module({
    imports: [
        MysqldbModule,
        AccountsVerifySheetMxModule,
        AccountsPayableModule,
        AccountsPayableMxModule,
        AccountsReceivableModule,
        AccountsReceivableMxModule
    ],
    controllers: [AccountsVerifySheetController],
    providers: [AccountsVerifySheetService, AccountsVerifySheetEntity],
    exports: [AccountsVerifySheetService]
})
export class AccountsVerifySheetModule {
}