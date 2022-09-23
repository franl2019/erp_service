import {Module} from "@nestjs/common";
import {AccountsVerifySheetMxController} from "./accountsVerifySheetMx.controller";
import {AccountsVerifySheetMxService} from "./accountsVerifySheetMx.service";
import {AccountsVerifySheetMxEntity} from "./accountsVerifySheetMx.entity";

@Module({
    controllers: [AccountsVerifySheetMxController],
    providers: [AccountsVerifySheetMxService, AccountsVerifySheetMxEntity],
    exports: [AccountsVerifySheetMxService]
})
export class AccountsVerifySheetMxModule {

}