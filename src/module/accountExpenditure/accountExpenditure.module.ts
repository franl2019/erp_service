import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountExpenditureEntity} from "./accountExpenditure.entity";
import {AccountExpenditureService} from "./accountExpenditure.service";
import {AccountExpenditureController} from "./accountExpenditure.controller";
import { AutoCodeMxModule } from "../autoCodeMx/autoCodeMx.module";
import { AccountRecordModule } from "../accountsRecord/accountRecord.module";

@Module({
    imports:[MysqldbModule,AutoCodeMxModule,AccountRecordModule],
    controllers:[AccountExpenditureController],
    providers:[AccountExpenditureEntity,AccountExpenditureService],
    exports:[AccountExpenditureService]
})
export class AccountExpenditureModule {

}