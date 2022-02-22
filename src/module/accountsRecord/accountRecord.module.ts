import {Module} from "@nestjs/common";
import {AccountRecordService} from "./accountRecord.service";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountRecordEntity} from "./accountRecord.entity";
import {AccountRecordController} from "./accountRecord.controller";

@Module({
    imports: [MysqldbModule],
    controllers:[AccountRecordController],
    providers: [AccountRecordService, AccountRecordEntity],
    exports: [AccountRecordService]
})
export class AccountRecordModule {
}