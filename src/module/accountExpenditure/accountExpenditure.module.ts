import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountExpenditureEntity} from "./accountExpenditure.entity";
import {AccountExpenditureService} from "./accountExpenditure.service";
import {AccountExpenditureController} from "./accountExpenditure.controller";
import { AutoCodeMxModule } from "../autoCodeMx/autoCodeMx.module";
import { AccountRecordModule } from "../accountsRecord/accountRecord.module";
import {AccountExpenditureAmountMxModule} from "../accountExpenditureAmountMx/accountExpenditureAmountMx.module";
import {AccountExpenditureSheetMxModule} from "../accountExpenditureSheetMx/accountExpenditureSheetMx.module";
import {AccountsPayableModule} from "../accountsPayable/accountsPayable.module";

@Module({
    imports:[MysqldbModule,AutoCodeMxModule,AccountRecordModule,AccountExpenditureAmountMxModule,AccountExpenditureSheetMxModule,AccountsPayableModule],
    controllers:[AccountExpenditureController],
    providers:[AccountExpenditureEntity,AccountExpenditureService],
    exports:[AccountExpenditureService]
})
export class AccountExpenditureModule {

}