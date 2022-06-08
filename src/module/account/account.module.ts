import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountController} from "./account.controller";
import {AccountEntity} from "./account.entity";
import {AccountService} from "./account.service";
import {AccountRecordModule} from "../accountsRecord/accountRecord.module";

@Module({
    imports: [MysqldbModule,AccountRecordModule],
    controllers: [AccountController],
    providers: [AccountEntity, AccountService],
    exports: [AccountService]
})
export class AccountModule {
}