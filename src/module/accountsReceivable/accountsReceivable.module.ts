import {Module} from "@nestjs/common";
import {AccountsReceivableService} from "./accountsReceivable.service";
import {AccountsReceivableEntity} from "./accountsReceivable.entity";
import {AccountsReceivableController} from "./accountsReceivable.controller";
import {AccountsReceivableMxModule} from "../accountsReceivableMx/accountsReceivableMx.module";
import {AccountsReceivableSubjectMxModule} from "../accountsReceivableSubjectMx/accountsReceivableSubjectMx.module";

@Module({
    imports: [
        AccountsReceivableMxModule,
        AccountsReceivableSubjectMxModule
    ],
    providers: [AccountsReceivableService, AccountsReceivableEntity],
    controllers: [AccountsReceivableController],
    exports: [AccountsReceivableService]
})
export class AccountsReceivableModule {}