import {Module} from "@nestjs/common";
import {AccountsPayableSubjectMxService} from "./accountsPayableSubjectMx.service";
import {AccountsPayableSubjectMxEntity} from "./accountsPayableSubjectMx.entity";

@Module({
    providers: [AccountsPayableSubjectMxService, AccountsPayableSubjectMxEntity],
    exports: [AccountsPayableSubjectMxService]
})
export class AccountsPayableSubjectMxModule {


}