import {Module} from "@nestjs/common";
import {AccountInComeSheetMxController} from "./accountInComeSheetMx.controller";
import {AccountInComeSheetMxService} from "./accountInComeSheetMx.service";
import {AccountInComeSheetMxEntity} from "./accountInComeSheetMx.entity";

@Module({
    controllers: [AccountInComeSheetMxController],
    providers: [AccountInComeSheetMxService, AccountInComeSheetMxEntity],
    exports: [AccountInComeSheetMxService]
})
export class AccountInComeSheetMxModule {
}