import {Module} from "@nestjs/common";
import {AccountExpenditureAmountMxEntity} from "./accountExpenditureAmountMx.entity";
import {AccountExpenditureAmountMxService} from "./accountExpenditureAmountMx.service";
import {AccountExpenditureAmountMxController} from "./accountExpenditureAmountMx.controller";

@Module({
    controllers: [AccountExpenditureAmountMxController],
    providers: [AccountExpenditureAmountMxEntity, AccountExpenditureAmountMxService],
    exports: [AccountExpenditureAmountMxService]
})
export class AccountExpenditureAmountMxModule {
}