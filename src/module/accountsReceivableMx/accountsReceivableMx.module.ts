import {Module} from "@nestjs/common";
import {AccountsReceivableMxController} from "./accountsReceivableMx.controller";
import {AccountsReceivableMxService} from "./accountsReceivableMx.service";
import {AccountsReceivableMxEntity} from "./accountsReceivableMx.entity";

@Module({
    controllers: [AccountsReceivableMxController],
    providers: [AccountsReceivableMxService, AccountsReceivableMxEntity],
    exports: [AccountsReceivableMxService]
})
export class AccountsReceivableMxModule {
}