import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountsPayableService} from "./accountsPayable.service";
import {AccountsPayableEntity} from "./accountsPayable.entity";
import {AccountsPayableController} from "./accountsPayable.controller";
import {AccountsPayableMxModule} from "../accountsPayableMx/accountsPayableMx.module";
import {AccountsPayableSubjectMxModule} from "../accountsPayableMxSubject/accountsPayableSubjectMx.module";

@Module({
    imports: [MysqldbModule,AccountsPayableMxModule,AccountsPayableSubjectMxModule],
    providers: [AccountsPayableService, AccountsPayableEntity],
    controllers: [AccountsPayableController],
    exports: [AccountsPayableService]
})
export class AccountsPayableModule {
}