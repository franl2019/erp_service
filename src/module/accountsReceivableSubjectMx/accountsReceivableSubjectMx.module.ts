import {Module} from "@nestjs/common";
import {AccountsReceivableSubjectMxService} from "./accountsReceivableSubjectMx.service";
import {AccountsReceivableSubjectMxEntity} from "./accountsReceivableSubjectMx.entity";

@Module({
    providers:[AccountsReceivableSubjectMxService,AccountsReceivableSubjectMxEntity],
    exports:[AccountsReceivableSubjectMxService]
})
export class AccountsReceivableSubjectMxModule {
}