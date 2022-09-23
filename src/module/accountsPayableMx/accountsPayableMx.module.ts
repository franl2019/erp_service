import {Module} from "@nestjs/common";
import {AccountsPayableMxController} from "./accountsPayableMx.controller";
import {AccountsPayableMxService} from "./accountsPayableMx.service";
import {AccountsPayableMxEntity} from "./accountsPayableMx.entity";

@Module({
    imports: [
        AccountsPayableMxModule
    ],
    controllers: [AccountsPayableMxController],
    providers: [AccountsPayableMxService, AccountsPayableMxEntity],
    exports: [AccountsPayableMxService]
})
export class AccountsPayableMxModule {}