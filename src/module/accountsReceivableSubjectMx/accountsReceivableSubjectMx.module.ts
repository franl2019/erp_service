import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountsReceivableSubjectMxService} from "./accountsReceivableSubjectMx.service";
import {AccountsReceivableSubjectMxEntity} from "./accountsReceivableSubjectMx.entity";

@Module({
    imports:[MysqldbModule],
    providers:[AccountsReceivableSubjectMxService,AccountsReceivableSubjectMxEntity],
    exports:[AccountsReceivableSubjectMxService]
})
export class AccountsReceivableSubjectMxModule {
}