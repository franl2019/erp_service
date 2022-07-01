import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {SaleOrderEntity} from "./saleOrder.entity";
import {SaleOrderService} from "./saleOrder.service";
import {SaleOrderController} from "./saleOrder.controller";
import {SaleOrderMxModule} from "../saleOrderMx/saleOrderMx.module";
import {AutoCodeMxModule} from "../autoCodeMx/autoCodeMx.module";

@Module({
    imports:[MysqldbModule,SaleOrderMxModule,AutoCodeMxModule],
    controllers:[SaleOrderController],
    providers:[SaleOrderEntity,SaleOrderService],
    exports:[SaleOrderService]

})
export class SaleOrderModule {

}