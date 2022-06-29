import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {SaleOrderEntity} from "./saleOrder.entity";
import {SaleOrderService} from "./saleOrder.service";
import {SaleOrderController} from "./saleOrder.controller";

@Module({
    imports:[MysqldbModule],
    controllers:[SaleOrderController],
    providers:[SaleOrderEntity,SaleOrderService],
    exports:[SaleOrderService]

})
export class SaleOrderModule {

}