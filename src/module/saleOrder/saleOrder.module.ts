import {Module} from "@nestjs/common";
import {SaleOrderEntity} from "./saleOrder.entity";
import {SaleOrderService} from "./saleOrder.service";
import {SaleOrderController} from "./saleOrder.controller";
import {SaleOrderMxModule} from "../saleOrderMx/saleOrderMx.module";
import {AutoCodeMxModule} from "../autoCodeMx/autoCodeMx.module";

@Module({
    imports:[
        SaleOrderMxModule,
        AutoCodeMxModule,

    ],
    controllers:[SaleOrderController],
    providers:[SaleOrderEntity,SaleOrderService],
    exports:[SaleOrderService]

})
export class SaleOrderModule {

}