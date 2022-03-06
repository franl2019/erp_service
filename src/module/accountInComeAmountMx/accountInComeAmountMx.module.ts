import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AccountInComeAmountMxController} from "./accountInComeAmountMx.controller";
import {AccountInComeAmountMxEntity} from "./accountInComeAmountMx.entity";
import {AccountInComeAmountMxService} from "./accountInComeAmountMx.service";

@Module({
    imports:[MysqldbModule],
    controllers:[AccountInComeAmountMxController],
    providers:[AccountInComeAmountMxEntity,AccountInComeAmountMxService],
    exports:[AccountInComeAmountMxService]
})
export class AccountInComeAmountMxModule {
}