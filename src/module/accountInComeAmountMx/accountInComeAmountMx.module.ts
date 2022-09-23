import {Module} from "@nestjs/common";
import {AccountInComeAmountMxController} from "./accountInComeAmountMx.controller";
import {AccountInComeAmountMxEntity} from "./accountInComeAmountMx.entity";
import {AccountInComeAmountMxService} from "./accountInComeAmountMx.service";

@Module({
    controllers:[AccountInComeAmountMxController],
    providers:[AccountInComeAmountMxEntity,AccountInComeAmountMxService],
    exports:[AccountInComeAmountMxService]
})
export class AccountInComeAmountMxModule {
}