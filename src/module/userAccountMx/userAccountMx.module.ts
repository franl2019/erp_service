import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {UserAccountMxEntity} from "./userAccountMx.entity";
import {UserAccountMxService} from "./userAccountMx.service";
import {UserAccountMxController} from "./userAccountMx.controller";

@Module({
    imports: [MysqldbModule],
    controllers: [UserAccountMxController],
    providers: [UserAccountMxEntity, UserAccountMxService],
    exports: [UserAccountMxService]
})
export class UserAccountMxModule {
}