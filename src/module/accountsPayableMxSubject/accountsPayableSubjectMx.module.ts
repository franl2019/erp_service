import {Module} from "@nestjs/common";
import {AccountsPayableSubjectMxService} from "./accountsPayableSubjectMx.service";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountsPayableSubjectMxEntity} from "./accountsPayableSubjectMx.entity";

@Module({
    imports: [MysqldbModule],
    providers: [AccountsPayableSubjectMxService, AccountsPayableSubjectMxEntity],
    exports: [AccountsPayableSubjectMxService]
})
export class AccountsPayableSubjectMxModule {


}