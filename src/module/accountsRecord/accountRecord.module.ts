import {Module} from "@nestjs/common";
import {AccountRecordService} from "./accountRecord.service";
import {AccountRecordEntity} from "./accountRecord.entity";
import {AccountRecordController} from "./accountRecord.controller";

@Module({
    controllers:[AccountRecordController],
    providers: [AccountRecordService, AccountRecordEntity],
    exports: [AccountRecordService]
})
export class AccountRecordModule {
}