import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountController} from "./account.controller";
import {AccountEntity} from "./account.entity";
import {AccountService} from "./account.service";

@Module({
    imports: [MysqldbModule],
    controllers: [AccountController],
    providers: [AccountEntity, AccountService],
    exports: [AccountService]
})
export class AccountModule {
}