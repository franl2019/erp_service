import {Module} from "@nestjs/common";
import {AccountController} from "./account.controller";
import {AccountEntity} from "./account.entity";
import {AccountService} from "./account.service";
import {AccountRecordModule} from "../accountsRecord/accountRecord.module";

@Module({
    imports: [AccountRecordModule],
    controllers: [AccountController],
    providers: [AccountEntity, AccountService],
    exports: [AccountService]
})
export class AccountModule {
}