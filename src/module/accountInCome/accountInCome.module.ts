import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountInComeController} from "./accountInCome.controller";
import {AccountInComeEntity} from "./accountInCome.entity";
import {AccountInComeService} from "./accountInCome.service";
import {AutoCodeMxModule} from "../autoCodeMx/autoCodeMx.module";
import {AccountRecordModule} from "../accountsRecord/accountRecord.module";

@Module({
    imports: [MysqldbModule,AutoCodeMxModule,AccountRecordModule],
    controllers: [AccountInComeController],
    providers: [AccountInComeEntity, AccountInComeService],
    exports: [AccountInComeService]
})
export class AccountInComeModule {

}