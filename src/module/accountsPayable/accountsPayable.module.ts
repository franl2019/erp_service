import {Module} from "@nestjs/common";
import {AccountsPayableService} from "./accountsPayable.service";
import {AccountsPayableEntity} from "./accountsPayable.entity";
import {AccountsPayableController} from "./accountsPayable.controller";
import {AccountsPayableMxModule} from "../accountsPayableMx/accountsPayableMx.module";
import {AccountsPayableSubjectMxModule} from "../accountsPayableMxSubject/accountsPayableSubjectMx.module";

@Module({
    imports: [
        AccountsPayableMxModule,
        AccountsPayableSubjectMxModule
    ],
    providers: [AccountsPayableService, AccountsPayableEntity],
    controllers: [AccountsPayableController],
    exports: [AccountsPayableService]
})
export class AccountsPayableModule {
}