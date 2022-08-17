import {Module} from "@nestjs/common";
import {ProductOtherUnitMxService} from "./productOtherUnitMx.service";
import {ProductOtherUnitMxEntity} from "./productOtherUnitMx.entity";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {ProductOtherUnitMxController} from "./productOtherUnitMx.controller";

@Module({
    imports:[MysqldbModule],
    controllers:[ProductOtherUnitMxController],
    providers:[ProductOtherUnitMxService,ProductOtherUnitMxEntity],
    exports:[ProductOtherUnitMxService]
})
export class ProductOtherUnitMxModule {
}