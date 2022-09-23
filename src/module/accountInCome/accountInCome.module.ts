import {Module} from "@nestjs/common";
import {AccountInComeController} from "./accountInCome.controller";
import {AccountInComeEntity} from "./accountInCome.entity";
import {AccountInComeService} from "./accountInCome.service";
import {AutoCodeMxModule} from "../autoCodeMx/autoCodeMx.module";
import {AccountRecordModule} from "../accountsRecord/accountRecord.module";
import {AccountInComeAmountMxModule} from "../accountInComeAmountMx/accountInComeAmountMx.module";
import {AccountsReceivableModule} from "../accountsReceivable/accountsReceivable.module";
import {AccountInComeSheetMxModule} from "../accountInComeSheetMx/accountInComeSheetMx.module";

@Module({
    imports: [
        AutoCodeMxModule,
        AccountRecordModule,
        AccountsReceivableModule,
        AccountInComeAmountMxModule,
        AccountInComeSheetMxModule
    ],
    controllers: [AccountInComeController],
    providers: [AccountInComeEntity, AccountInComeService],
    exports: [AccountInComeService]
})
export class AccountInComeModule {

}