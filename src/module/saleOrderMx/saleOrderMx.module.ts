import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {SaleOrderMxEntity} from "./saleOrderMx.entity";
import {SaleOrderMxService} from "./saleOrderMx.service";
import {SaleOrderMxController} from "./saleOrderMx.controller";

@Module({
    imports:[MysqldbModule],
    controllers:[SaleOrderMxController],
    providers:[SaleOrderMxEntity,SaleOrderMxService],
    exports:[SaleOrderMxService]
})
export class SaleOrderMxModule {

}