import {Module} from "@nestjs/common";
import {AccountExpenditureSheetMxEntity} from "./accountExpenditureSheetMx.entity";
import {AccountExpenditureSheetMxService} from "./accountExpenditureSheetMx.service";
import {AccountExpenditureSheetMxController} from "./accountExpenditureSheetMx.controller";

@Module({
    controllers:[AccountExpenditureSheetMxController],
    providers:[AccountExpenditureSheetMxEntity,AccountExpenditureSheetMxService],
    exports:[AccountExpenditureSheetMxService]
})
export class AccountExpenditureSheetMxModule {

}